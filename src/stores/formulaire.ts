import { defineStore } from "pinia";

export type Formulaire = {
  type_imagerie: null | string;
  type_examen: null | string;
  urgent: boolean | null;
  date_max: null | string;
  nom: null | string;
  prénom: null | string;
  date_naissance: null | string;
  tel: null | string;
  email: null | string;
};

export type keyForm =
  | "type_imagerie"
  | "type_examen"
  | "urgent"
  | "date_max"
  | "nom"
  | "prénom"
  | "date_naissance"
  | "tel"
  | "email";

export const formulaireStore = defineStore({
  id: "formulaire",
  state: (): Formulaire => {
    return {
      type_imagerie: null,
      type_examen: null,
      urgent: false,
      date_max: null,
      nom: null,
      prénom: null,
      date_naissance: null,
      tel: null,
      email: null,
    };
  },
});
