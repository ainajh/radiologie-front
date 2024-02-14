
export interface User {
      id: number ,
      nom: string,
      tel: string,
      adresse: string,
      email: string,
      rpps: string,
      role: string,
      is_verified: number 
    
  }
  
  const  getAll  =  async ( ) : Promise<[User] | undefined>  => {
    try {
      const { $api } = useNuxtApp();
      const response = await $api?.get(`/user`, {
        headers: {
          Authorization: `Bearer ${useCookie("token").value}`,
        },
      });
      console.log(response)
      return response.data.users
    } catch (error: any) {
      console.log(error);
    }
  }
  
  const UserService =  {
    getAll
  }
  
  export default UserService
  
  
  
  