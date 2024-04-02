export interface UserInterface {
  id: number;
  nom: string;
  tel: string;
  adresse: string;
  email: string;
  rpps: string;
  role: string;
  is_verified: number;
}

const getAll = async (
  role = "radiologue"
): Promise<[UserInterface] | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.get(`/user/only-type/${role}`, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });
    // console.log( response);
    return response.data?.users;
  } catch (error: any) {
    console.log(error);
  }
};

const UserService = {
  getAll,
};

export default UserService;
