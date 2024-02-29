import type { AxiosResponse } from "axios";
import type { LeaveData } from "~/utils/constants/leave-interface";
const resDataHandler = (res: AxiosResponse) => {
  // console.log(res);
  switch (res.status) {
    case 200: {
      return res.data?.data;
    }
    case 201: {
      return res.data?.data;
    }
    case 400: {
      return res.data?.data;
    }
    case 422: {
      return res.data?.data;
    }
    case 500: {
      return res.data?.data;
    }
    default: {
      return res.data;
    }
  }
};

const getAll = async (): Promise<[LeaveData] | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.get(`/leave`, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    console.log(error);
  }
};

const getAllOfOnePerson = async (
  idPerson: number
): Promise<[LeaveData] | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.get(`/leave/leaveOfPerson/${idPerson}`, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    console.log(error);
  }
};

const getAllBetweenTwoDate = async (
  dateStart: string,
  dateEnd: string
): Promise<[LeaveData] | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.post(
      `/leave`,
      { dateStart, dateEnd },
      {
        headers: {
          Authorization: `Bearer ${useCookie("token").value}`,
        },
      }
    );

    return resDataHandler(response);
  } catch (error: any) {
    console.log(error);
  }
};

const create = async (data: LeaveData): Promise<LeaveData | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.post(`/leave/add`, data, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    console.log(error);
  }
};

const update = async (data: LeaveData): Promise<LeaveData | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.put(`/leave/update/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    console.log(error);
  }
};

const isDisponble = async (
  idPerson: number,
  dateToCheck: string
): Promise<LeaveData[] | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.post(
      `/leave/isDisponible`,
      { idPerson, dateToCheck },
      {
        headers: {
          Authorization: `Bearer ${useCookie("token").value}`,
        },
      }
    );

    return resDataHandler(response);
  } catch (error: any) {
    console.log(error);
  }
};

const deleteOne = async (id: number): Promise<LeaveData | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.delete(`/leave/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    console.log(error);
  }
};

const LeaveService = {
  getAll,
  create,
  deleteOne,
  update,
  isDisponble,
  getAllOfOnePerson,
  getAllBetweenTwoDate,
};

export default LeaveService;
