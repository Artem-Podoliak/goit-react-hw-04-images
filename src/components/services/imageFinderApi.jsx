const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34388571-e7436fad89988abd77e9e1e04';

export default async function findImages(searchQuery, page) {
  const response = await fetch(
    `${BASE_URL}?q=${searchQuery}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );
  return await response.json();
}
