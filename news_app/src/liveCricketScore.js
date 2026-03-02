//78a78838-c052-4317-aafa-ff403fdf4cf9
import React, { useState, useEffect } from "react";
import "./LiveCricketScore.css";

const LiveCricketScore = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // For now, use mock data to avoid API issues
    const mockMatches = [
      {
        id: 1,
        teams: ["India", "Australia"],
        score: "245/3 (42.0)",
        status: "Live",
        tournament: "World Test Championship"
      },
      {
        id: 2,
        teams: ["England", "South Africa"],
        score: "189/6 (35.0)",
        status: "Live", 
        tournament: "T20 Series"
      }
    ];
    
    setMatches(mockMatches);
    setLoading(false);
    
    //Uncomment below when you have a working API key
    
    const fetchLiveScores = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.cricapi.com/v1/currentMatches?apikey=78a78838-c052-4317-aafa-ff403fdf4cf9&offset=0"
        );
        
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const data = await response.json();
        
        if (data.status !== "success") {
          throw new Error("API error: " + (data.message || "Unknown error"));
        }
        
        const liveMatches = (data.data || [])
          .filter(match => match.status && match.status.includes("Live"))
          .slice(0, 2);
        
        setMatches(liveMatches);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLiveScores();
    const intervalId = setInterval(fetchLiveScores, 30000);
    return () => clearInterval(intervalId);
    
  }, []);

  if (loading) {
    return (
      <div className="live-cricket-minimal">
        <div className="cricket-mini-header" onClick={() => setExpanded(!expanded)}>
          <span className="cricket-icon"></span>
          <span className="cricket-label">sports</span>
          <span className="cricket-indicator loading">Loading...</span>
          <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>
    );
  }

  return (
    <div className="live-cricket-minimal">
      <div className="cricket-mini-header" onClick={() => setExpanded(!expanded)}>
        <span className="cricket-icon"></span>
        <span className="cricket-label"> Cricket</span>
        {matches.length > 0 && (
          <span className="cricket-indicator live">
            {matches.length} live match{matches.length !== 1 ? 'es' : ''}
          </span>
        )}
        <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      {expanded && (
        <div className="cricket-mini-content">
          {error ? (
            <div className="cricket-error">
              {error}. <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : matches.length === 0 ? (
            <p className="no-matches">No live matches currently</p>
          ) : (
            matches.map((match) => (
              <div key={match.id} className="cricket-mini-match">
                <div className="mini-match-tournament">{match.tournament || "International Match"}</div>
                <div className="mini-match-teams">
                  <span className="mini-team">{match.teams && match.teams[0]}</span>
                  <span className="mini-vs">vs</span>
                  <span className="mini-team">{match.teams && match.teams[1]}</span>
                </div>
                <div className="mini-match-score">{match.score || "Match about to begin"}</div>
                <div className="mini-match-status">
                  <span className="status-dot"></span>
                  {match.status || "Status not available"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LiveCricketScore;