import React, { useState } from 'react';
import styles from './SearchPage.module.scss';
import { KaiStudio } from 'kaistudio-sdk-js';
import SearchBar from './SearchBar';
import type { SearchResult } from 'kaistudio-sdk-js/modules/Search';


if (!import.meta.env.VITE_REACT_APP_ORGANIZATION_ID || !import.meta.env.VITE_REACT_APP_INSTANCE_ID || !import.meta.env.VITE_REACT_APP_API_KEY) {
    throw new Error('Missing required environment variables');
}

const sdk = new KaiStudio({
    organizationId: import.meta.env.VITE_REACT_APP_ORGANIZATION_ID,
    instanceId: import.meta.env.VITE_REACT_APP_INSTANCE_ID,
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
});

const SearchPage: React.FC = () => {
    const [searchInput, setValue] = useState<string>('');

    const [searchAnswer, setResults] = useState<SearchResult>({
        query: '',
        answer: '',
        reason: '',
        confidentRate: 0,
        gotAnswer: false, 
        documents: [],
        followingQuestions: [],
    });

    const fetchData = async (input:string) => {
        try {
            if (input !== '') {
                const searchResult = await sdk.search().query(input, '');
                setResults(searchResult);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = () => {
        fetchData(searchInput);
    };

    const searchNewQuestion = (question:string) => {
        setValue(question);
        fetchData(question);
    }

    return (
        <div className={styles.content}>
            <div className={styles.logo}>
                <img src="/logo.svg" alt="logo" />
            </div>
            <SearchBar searchInput={searchInput} setValue={setValue} handleSearch={handleSearch} />
            <div className={styles.searchResult}>
                {searchAnswer.answer !== '' && (
                    <div>
                        <p className={styles.answer}>{searchAnswer.answer}</p>
                        <div className={styles.answerBlock}>
                            <p className={styles.answerTitle}>Reason</p>
                            <p className={styles.answerContent} >
                                {searchAnswer.reason}
                            </p>
                        </div>
                        <div className={styles.answerBlock}>
                            <p className={styles.answerTitle}>Source</p>
                            {searchAnswer.documents.length > 0 ? (
                                searchAnswer.documents.map((source, index) => (
                                    <p className={styles.answerContent} key={index}>
                                        <a href={source.url} target="_blank">{source.name}</a>
                                    </p>
                                ))
                            ) : (
                                <p>No results found</p>
                            )}
                        </div>
                        <div className={styles.answerBlock}>
                            <p className={styles.answerTitle}>Related-questions</p>
                            {searchAnswer.followingQuestions.length > 0 ? (
                                searchAnswer.followingQuestions.map((question, index) => (
                                    <p className={`${styles.answerContent} ${styles.clickable}`} key={index} onClick={()=>{searchNewQuestion(question)}} >
                                        {question}
                                    </p>
                                ))
                            ) : (
                                <p>No results found</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;