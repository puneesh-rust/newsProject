import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newsHeadlines, setNewsHeadlines] = useState([]);
    const [previousHeadlines, setPreviousHeadlines] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const fetchNewsForDate = async (date) => {
        try {
            const startOfDay = Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)));
            const endOfDay = Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)));

            const headlinesQuery = query(
                collection(db, 'headlines'),
                where('date', '>=', startOfDay),
                where('date', '<=', endOfDay)
            );

            const querySnapshot = await getDocs(headlinesQuery);
            const fetchedNews = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setPreviousHeadlines(newsHeadlines);
            setNewsHeadlines(fetchedNews);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
};

    useEffect(() => {
        fetchNewsForDate(selectedDate);
    }, [selectedDate]);

    return (
        <div className={App ${darkMode ? 'dark-mode' : 'light-mode'}}>
            <header className="app-header">
                <h1>📰 News Calendar</h1>
                <button className="toggle-button" onClick={toggleDarkMode}>
                    {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </header>

            <main>
                <div className="calendar-wrapper">
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        className="modern-calendar"
                        tileClassName={({ date, view }) =>
                            view === 'month' && date.toDateString() === selectedDate.toDateString()
                                ? 'calendar-tile selected-tile'
                                : 'calendar-tile'
                        }
                    />
                </div>

                <div className="news-container">
                    <AnimatePresence>
                        {newsHeadlines.map((news) => (
                            <motion.div
                                key={news.id}
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
exit={{ x: 300, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="news-item"
                            >
                                <h3>{news.title}</h3>
                                <p>{news.description || 'No description available.'}</p>
                                <a href={news.link} target="_blank" rel="noopener noreferrer">
                                    Read more &rarr;
                                </a>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {newsHeadlines.length === 0 && (
                        <p className="no-news">No news available for the selected date.</p>
                    )}
                </div>
            </main>

            <footer>
                <p>Built with ❤ by News Calendar App</p>
            </footer>
        </div>
    );
}

export default App;