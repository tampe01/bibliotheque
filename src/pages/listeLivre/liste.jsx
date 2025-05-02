import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { exit } from 'process';
console.clear();

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function ListeLivre() {
  const [listeLivres, setListeLivre] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Nombre d'éléments par page par défaut
  

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
                    <td>{listeLivre.Titre}</td>
                    <td>{formatDate(listeLivre.Date_publication)}</td>
                    <td>{listeLivre.Auteur}</td>
                    <td>{listeLivre.statut}</td>
                    <td>{listeLivre.resume}</td>
                    <td> <button className='bouton' onClick={() => handlesupp(listeLivre.Id_livre)}>Supprimer</button></td>
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