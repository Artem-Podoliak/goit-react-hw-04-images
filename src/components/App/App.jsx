import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import findImages from './../services/imageFinderApi';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import FrontNotification from 'components/FrontNotification';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Loader from 'components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { AppWrapper } from './App.styled';

const App = () => {
  const Status = {
    IDLE: 'idle',
    PENDING: 'pending',
    RESOLVED: 'resolved',
    REJECTED: 'rejected',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [imagesSet, setImagesSet] = useState([]);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);
  const [showBtn, setShowBtn] = useState(false);
  const galleryElem = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { hits, totalHits } = await findImages(searchQuery, page);
        if (totalHits === 0) {
          rejectedStatusHandler();
          showIncorrectQuery(searchQuery);
          return;
        }

        if (page === 1) {
          setTotalImages(totalHits); // Update totalImages with the totalHits value
          showSearchResult(totalHits);
        }
        const showButton = page < Math.ceil(totalHits / 12);

        setImagesSet(prevImagesSet => [...prevImagesSet, ...hits]);
        setStatus(Status.RESOLVED);
        setShowBtn(showButton);
        makeSmoothScroll();
      } catch (error) {
        console.log(error);
        rejectedStatusHandler();
        showQueryError(error);
      }
    };

    if (searchQuery.trim() !== '') {
      setStatus(Status.PENDING);
      fetchData();
    }
  }, [searchQuery, page]);

  const rejectedStatusHandler = () => {
    setStatus(Status.REJECTED);
    // setStatus(Status.IDLE);
  };

  const showSearchResult = totalImages => {
    toast.success(`Hooray! We found ${totalImages} images.`);
  };

  const showIncorrectQuery = searchQuery => {
    toast.error(
      `Sorry, there are no images matching your query: "${searchQuery}". Please try to search something else.`
    );
  };

  const showQueryError = error => {
    toast.error(`You caught the following error: ${error.message}.`);
  };

  const onFormSubmit = newSearchQuery => {
    setSearchQuery(newSearchQuery);
    setImagesSet([]);
    setPage(1);
    setStatus(Status.PENDING);
  };

  const makeSmoothScroll = () => {
    const cardHeight = galleryElem.current.firstElementChild.clientHeight;
    window.scrollBy({ top: cardHeight * 1.97, behavior: 'smooth' });
  };

  const onLoadBtnClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const toggleModal = newLargeImageURL => {
    setShowModal(prevShowModal => !prevShowModal);
    setLargeImageURL(newLargeImageURL);
  };

  return (
    <AppWrapper>
      <Searchbar onSubmit={onFormSubmit} />
      {status === Status.IDLE && (
        <FrontNotification text="Type your image request in searchbar and get an awesome collection of pictures." />
      )}
      {status === Status.PENDING && <Loader />}
      {status === Status.RESOLVED && (
        <>
          <ImageGallery
            imagesSet={imagesSet}
            onClick={toggleModal}
            scrollRef={galleryElem}
          />
          {imagesSet.length > page * 12 && showBtn && (
            <Button onClick={onLoadBtnClick} />
          )}

          {showModal && (
            <Modal
              largeImageURL={largeImageURL}
              alt={searchQuery}
              onClose={toggleModal}
            />
          )}
        </>
      )}
      {status === Status.REJECTED && (
        <FrontNotification text="Oops! Something went wrong." />
      )}
      <ToastContainer autoClose={4000} />
    </AppWrapper>
  );
};

export default App;
