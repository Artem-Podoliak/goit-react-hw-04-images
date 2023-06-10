import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { IconContext } from 'react-icons';
import { MdSearch } from 'react-icons/md';
import {
  SearchbarContainer,
  SearchForm,
  SearchFormBtn,
  SearchFormBtnLabel,
  SearchFormInput,
} from './Searchbar.styled';

const Searchbar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const onInputChange = evt => {
    const normalizeInputValue = evt.currentTarget.value.toLowerCase();

    setSearchQuery(normalizeInputValue);
  };

  const handleSubmit = evt => {
    evt.preventDefault();

    if (searchQuery.trim() === '') {
      showSearchQueryAbsence();
      formReset();
      return;
    }

    onSubmit(searchQuery);
    formReset();
  };

  const formReset = () => {
    setSearchQuery('');
  };

  const showSearchQueryAbsence = () => {
    toast.warn(
      'No, no, no! God, no! To search for pictures you need to specify what you are looking for.'
    );
  };

  return (
    <SearchbarContainer onSubmit={handleSubmit}>
      <SearchForm>
        <SearchFormBtn type="submit" aria-label="Search images">
          <IconContext.Provider value={{ size: '2.5em' }}>
            <MdSearch />
          </IconContext.Provider>
          <SearchFormBtnLabel>Search</SearchFormBtnLabel>
        </SearchFormBtn>

        <SearchFormInput
          type="text"
          name="search"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchQuery}
          onChange={onInputChange}
        />
      </SearchForm>
    </SearchbarContainer>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
