import type { Country } from '../types/models'

export const NAME_POOLS: Record<Country, { first: string[]; last: string[] }> = {
  England: {
    first: [
      'James', 'Harry', 'George', 'Jack', 'Oliver', 'Charlie', 'Callum', 'Ryan', 'Connor', 'Dean',
      'Thomas', 'William', 'Joseph', 'Daniel', 'Liam', 'Ethan', 'Joshua', 'Owen', 'Lewis', 'Aaron',
      'Jordan', 'Kyle', 'Alfie', 'Freddie', 'Reece', 'Tyler', 'Adam', 'Luke', 'Sam', 'Ben',
    ],
    last: [
      'Smith', 'Taylor', 'Brown', 'Wilson', 'Walker', 'Hughes', 'Cole', 'Barnes', 'Foster', 'Clarke',
      'Robinson', 'Wright', 'Evans', 'Green', 'Baker', 'Turner', 'Hill', 'Ward', 'Fisher', 'Shaw',
      'Bell', 'Gray', 'Bailey', 'Marsh', 'Reid', 'Chapman', 'Stone', 'Palmer', 'Knight', 'Webb',
    ],
  },
  Spain: {
    first: [
      'Javier', 'Carlos', 'Diego', 'Alejandro', 'Pablo', 'Sergio', 'Iker', 'Rodrigo', 'Adrian', 'Mateo',
      'Manuel', 'David', 'Fernando', 'Álvaro', 'Hugo', 'Marcos', 'Raúl', 'Guillermo', 'Victor', 'Enzo',
      'Gonzalo', 'Ivan', 'Óscar', 'Bruno', 'Emilio', 'Roberto', 'Jorge', 'Angel', 'Cesar', 'Nicolas',
    ],
    last: [
      'García', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Díaz', 'Torres', 'Ramos',
      'Ruiz', 'Alonso', 'Romero', 'Navarro', 'Molina', 'Delgado', 'Castro', 'Ortega', 'Rubio', 'Marín',
      'Iglesias', 'Vega', 'Cano', 'Prieto', 'Santos', 'Domínguez', 'Vargas', 'Reyes', 'Cortés', 'Gil',
    ],
  },
  Italy: {
    first: [
      'Marco', 'Luca', 'Matteo', 'Alessandro', 'Davide', 'Simone', 'Gianluca', 'Andrea', 'Francesco', 'Riccardo',
      'Lorenzo', 'Federico', 'Stefano', 'Fabio', 'Giorgio', 'Antonio', 'Roberto', 'Emanuele', 'Salvatore', 'Nicolò',
      'Daniele', 'Cristiano', 'Paolo', 'Massimo', 'Enrico', 'Tommaso', 'Pietro', 'Vincenzo', 'Michele', 'Giacomo',
    ],
    last: [
      'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno',
      'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri',
      'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Leone', 'Longo', 'Martini',
    ],
  },
  France: {
    first: [
      'Antoine', 'Baptiste', 'Hugo', 'Lucas', 'Mathis', 'Nathan', 'Théo', 'Louis', 'Maxime', 'Julien',
      'Gabriel', 'Adam', 'Raphaël', 'Arthur', 'Paul', 'Victor', 'Enzo', 'Noah', 'Léo', 'Tom',
      'Quentin', 'Romain', 'Clément', 'Yanis', 'Malik', 'Bilal', 'Dylan', 'Kevin', 'Florian', 'Alexandre',
    ],
    last: [
      'Martin', 'Bernard', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefèvre', 'Roux', 'Fontaine',
      'Girard', 'Bonnet', 'Dupont', 'Lambert', 'Faure', 'Mercier', 'Blanc', 'Guerin', 'Muller', 'Henry',
      'Fournier', 'Chevalier', 'Robin', 'Morel', 'Nicolas', 'Perrin', 'Leroy', 'Gauthier', 'Masson', 'Renard',
    ],
  },
  Portugal: {
    first: [
      'João', 'Bruno', 'Ricardo', 'Nuno', 'Tiago', 'Miguel', 'Pedro', 'Rui', 'André', 'Diogo',
      'Rafael', 'Gonçalo', 'Hugo', 'Vasco', 'Duarte', 'Francisco', 'Simão', 'Luís', 'Fábio', 'Márcio',
      'Bernardo', 'Filipe', 'Ivo', 'Sérgio', 'Vitor', 'Renato', 'Carlos', 'Paulo', 'Alexandre', 'Manuel',
    ],
    last: [
      'Silva', 'Santos', 'Ferreira', 'Pereira', 'Costa', 'Rodrigues', 'Carvalho', 'Gomes', 'Martins', 'Sousa',
      'Fernandes', 'Marques', 'Alves', 'Ribeiro', 'Nunes', 'Teixeira', 'Correia', 'Mendes', 'Pinto', 'Machado',
      'Araújo', 'Cardoso', 'Rocha', 'Neves', 'Coelho', 'Cunha', 'Pires', 'Ramos', 'Reis', 'Simões',
    ],
  },
}
