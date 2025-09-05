import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

// Icône réutilisable
function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

// Item générique
function AccordionItem({ id, open, handleOpen, title, content }) {
  return (
    <Accordion
      open={open === id}
      icon={<Icon id={id} open={open} />}
      className="bg-[#E9E4DA]"
    >
      <AccordionHeader
        onClick={() => handleOpen(id)}
        className="px-4 text-[#111827] bg-[#E9E4DA]"
      >
        <p>{title}</p>
      </AccordionHeader>
      <AccordionBody className="px-4 pb-4 text-[#111827] bg-[#E9E4DA]">
        <p> {content} </p>
      </AccordionBody>
    </Accordion>
  );
}

// Conteneur principal
export function DefaultAccordion({ items }) {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div className="border-2 border-[#3E3A4D] rounded-[20px] overflow-hidden bg-[#E9E4DA]">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          id={index + 1}
          open={open}
          handleOpen={handleOpen}
          title={item.title}
          content={item.content}
        />
      ))}
    </div>
  );
}

// pour l'utiliser :
// {
//   /* <DefaultAccordion
//               items={[
//                 {
//                   title: "Qu’est ce que le jeu de rôle ?",
//                   content:
//                     "yes is a giroud",
//                 },
//                 {
//                   title: "RollUp! C’est quoi ?",
//                   content:
//                     "yes is a giroud",
//                 },
//                 {
//                   title: "Tu ne sais pas ou commencer ?",
//                   content:
//                     "yes is a giroud",
//                 },
//                 {
//                   title: "Créer ou rejoins une table",
//                   content:
//                     "yes is a giroud",
//                 },
//               ]}
//             /> */
// }
