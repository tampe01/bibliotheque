import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { exit } from 'process';
import { Link } from 'react-router-dom'

import { useHistory } from 'react-router-dom';

console.clear();

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function ListeLivre() {
  const [bookData, setBookData] = useState({
      Titre: '',
      Auteur: '',
      genres: [],
      Date_publication: '',
      resume: '',
      photo: null,
  });

  const [listeLivres, setListeLivre] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Nombre d'éléments par page par défaut

  const [selectedBook, setSelectedBook] = useState(null);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const history = useHistory();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/app/listeLivre');
        if (response.data.length === 0) {
          setError('Aucun résultat trouvé.');
        } else {
          setListeLivre(response.data);
        }
      } catch (error) {
        console.error('Error fetching se_livre records:', error);
        setError('Une erreur s\'est produite lors de la récupération des enregistrements.');
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(listeLivres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, listeLivres.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlesupp = async (id) => {
    try {
      // Construction correcte de l'URL avec l'ID
      const response = await axios.delete(`http://localhost:8000/app/listeLivre/${id}`);
      
      if (response.status === 200) {
        alert('Suppression réussie');
        window.location.reload();
        // Vous pouvez ajouter du code ici pour mettre à jour l'interface utilisateur après la suppression
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handlesmodif = async (book) => {
    if (book && book.Id_livre) {
        history.push({
            pathname: `/app/listeupdate/${book.Id_livre}`,
            state: { book }
        });
        
      console.log('modif')
      console.log(book)

      try {

        const response = await axios.post('http://localhost:8000/app/listeLivreUpdate/', book);
        console.log(response)
        
      } catch (error) {
        console.error('Erreur lors de la Modification:', error);
        alert('Erreur lors de la Modification',error);
      }

    } else {
        console.error('Book id is undefined:', book);
    }
};

  const handlesmodif2 = async (id) => {
    setSelectedBook(id);
    setShowFullSummary(false);

    // try {
    //   // Construction correcte de l'URL avec l'ID
    //   const response = await axios.update(`http://localhost:8000/app/listeLivre/${id}`);
      
    //   if (response.status === 200) {
    //     alert('Modification réussie');
    //     window.location.reload();
    //     // Vous pouvez ajouter du code ici pour mettre à jour l'interface utilisateur après la suppression
    //   }
    // } catch (error) {
    //   console.error('Erreur lors de la Modification:', error);
    //   alert('Erreur lors de la Modification');
    // }
  };

  const handleReserver = async (book) => {
    console.log('modif')
    console.log(book)
    try {
      // Construction correcte de l'URL avec l'ID
      const response = await axios.post('http://localhost:8000/app/listeLivreUpdate/', book);
      console.log(response)
      if (response.status === 200) {
        alert('Modification réussie');
        window.location.reload();
        // Vous pouvez ajouter du code ici pour mettre à jour l'interface utilisateur après la suppression
      }
    } catch (error) {
      console.error('Erreur lors de la Modification:', error);
      alert('Erreur lors de la Modification',error);
    }
  };

  const closePopup = () => {
    setSelectedBook(null);
  };

  const toggleFullSummary = () => {
    setShowFullSummary(!showFullSummary);
};

  const truncateSummary = (summary, limit) => {
    if (!summary) return '';
    if (summary.length <= limit) {
        return summary;
    }
    return summary.slice(0, limit) + '... ';
};

  return (
    <div className='search-pag'>
      <h1>Liste des Livres:</h1>

      <div className="results">
        {error && <p className="error">{error}</p>}
        {listeLivres.length > 0 ? (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Id du livre</th>
                  <th>Titre du livre</th>
                  <th>Date publication</th>
                  <th>Auteur</th>
                  <th>Statut</th>
                  <th>resume</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listeLivres.slice(startIndex, endIndex).map((listeLivre, index) => (
                  <tr key={index}>
                    <td>{listeLivre.Id_livre}</td>
                    <td>{listeLivre.Titre}</td>
                    <td>{formatDate(listeLivre.Date_publication)}</td>
                    <td>{listeLivre.Auteur}</td>
                    <td>{listeLivre.statut}</td>
                    <td>{listeLivre.resume}</td>
                    <td> 
                        <button className='bouton' onClick={() => handlesupp(listeLivre.Id_livre)}>Supprimer</button>|
                        <button className='bouton'  onClick={() => handlesmodif(listeLivre)}> Modifier </button>
                        
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="pagination">
              {currentPage > 1 && (
                <button onClick={() => handlePageChange(currentPage - 1)}>Précédent</button>
              )}
              <span>{currentPage}</span>
              {currentPage < totalPages && (
                <button onClick={() => handlePageChange(currentPage + 1)}>Suivant</button>
              )}
            </div>

            <div>
              <label htmlFor="itemsPerPage">Items par page:</label>
              <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        ) : (
          <p>Aucun résultat trouvé</p>
        )}
      </div>
    </div>
  );
}

export default ListeLivre;