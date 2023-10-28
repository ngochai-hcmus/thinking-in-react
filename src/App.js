import { useEffect, useState } from 'react';

function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner">
      </div>
    </div>
  );
}

export default function App() {
  const [history, setHistory] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [searchText, setSearchText] = useState('dog');
  const [finalSearch, setFinalSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  async function loadImages() {
    if (!finalSearch)
      return;

    if (page === 1) {
      const response = await fetch(`https://api.unsplash.com/search/photos/?query=${searchText}&page=${page}&client_id=u4zn-nrPHRu4FdT_QDAJZvFAgCuqT6_xSCW2Cf6L7Bw`);
      const imagesResult = await response.json();
      setImageUrls(imagesResult.results.map(image => image.urls.small));
    } else {
      setTimeout(async () => {
        const response = await fetch(`https://api.unsplash.com/search/photos/?query=${searchText}&page=${page}&client_id=u4zn-nrPHRu4FdT_QDAJZvFAgCuqT6_xSCW2Cf6L7Bw`);
        const imagesResult = await response.json();
        const newImageUrls = imagesResult.results.map(image => image.urls.small);
        setImageUrls(prevImageUrls => [...prevImageUrls, ...newImageUrls]);
        setIsFetching(false);
      }, 2000);
    }
  }

  useEffect(() => {
    loadImages();
  },
    [finalSearch, page]);

  function loadMore() {
    if (!finalSearch)
      return;

    setPage(page + 1);
  }

  useEffect(() => {
    if (!isFetching) return;
    loadMore();
  }, [isFetching]);

  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    setIsFetching(true);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      <div>
        <input value={searchText}
          onChange={(e) => setSearchText(e.target.value)}></input>
        <button onClick={() => { setHistory(finalSearch); setFinalSearch(searchText); history != finalSearch? setPage(1) : null}}>Search</button>
      </div>
      <div id='gallery'>
        {imageUrls.map((url, index) => (<img key={index} src={url} alt="" />))}
      </div>
      {isFetching ? <LoadingSpinner /> : null}
    </div>
  );
}