import type { AxiosResponse } from "axios";
import type { LeaveData } from "~/utils/constants/leave-interface";
import { useToast } from "vue-toastification";

const resDataHandler = (res: AxiosResponse) => {
  // console.log(res);
  const toast = useToast();
  switch (res.status) {
    case 200: {
      if (res.data?.message) toast.success(res.data?.message);
      return res.data?.data;
    }
    case 201: {
      if (res.data?.message) toast.success(res.data?.message);
      return res.data?.data;
    }
    case 422: {
      if (res.data?.message) toast.error(res.data?.message);
      return res.data?.data;
    }
    case 500: {
      if (res.data?.message) toast.error(res.data?.message);
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
    return resDataHandler(error.response);
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
    return resDataHandler(error.response);
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
    return resDataHandler(error.response);
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
    return resDataHandler(error.response);
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
    return resDataHandler(error.response);
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
    return resDataHandler(error.response);
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
    return resDataHandler(error.response);
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
