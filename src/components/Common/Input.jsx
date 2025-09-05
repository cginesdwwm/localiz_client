/*
  Input.jsx
  - Composant input très simple utilisé pour les exemples.
  - Props:
    - type: type de l'input (text, password, email, ...)
  Remarque: ici les styles sont basiques; on peut étendre ce composant pour
  accepter value, onChange, placeholder, etc.
*/

export default function Input({ type }) {
  return <input className="border-red-100 border" type={type} />;
}
