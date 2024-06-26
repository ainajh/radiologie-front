export interface Types {
  id: number;
  nom_type: string;
  nom_sous_type: string;
}

const getAll = async (): Promise<[Types] | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.get(`/type`, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });
    return response.data?.types;
  } catch (error: any) {
    console.log(error);
  }
};
const getAllPlaces = async (): Promise<[Types] | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.get(`/place`, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });
    return response.data?.places;
  } catch (error: any) {
    console.log(error);
  }
};

const TypeService = {
  getAll,
  getAllPlaces,
};

export default TypeService;
