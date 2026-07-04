import type { Country } from '../types/models'

export const NAME_POOLS: Record<Country, { first: string[]; last: string[] }> = {
  England: {
    first: ['James', 'Harry', 'George', 'Jack', 'Oliver', 'Charlie', 'Callum', 'Ryan', 'Connor', 'Dean'],
    last: ['Smith', 'Taylor', 'Brown', 'Wilson', 'Walker', 'Hughes', 'Cole', 'Barnes', 'Foster', 'Clarke'],
  },
  Spain: {
    first: ['Javier', 'Carlos', 'Diego', 'Alejandro', 'Pablo', 'Sergio', 'Iker', 'Rodrigo', 'Adrian', 'Mateo'],
    last: ['García', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Díaz', 'Torres', 'Ramos'],
  },
  Italy: {
    first: ['Marco', 'Luca', 'Matteo', 'Alessandro', 'Davide', 'Simone', 'Gianluca', 'Andrea', 'Francesco', 'Riccardo'],
    last: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno'],
  },
  France: {
    first: ['Antoine', 'Baptiste', 'Hugo', 'Lucas', 'Mathis', 'Nathan', 'Théo', 'Louis', 'Maxime', 'Julien'],
    last: ['Martin', 'Bernard', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefèvre', 'Roux', 'Fontaine'],
  },
  Portugal: {
    first: ['João', 'Bruno', 'Ricardo', 'Nuno', 'Tiago', 'Miguel', 'Pedro', 'Rui', 'André', 'Diogo'],
    last: ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Costa', 'Rodrigues', 'Carvalho', 'Gomes', 'Martins', 'Sousa'],
  },
}
