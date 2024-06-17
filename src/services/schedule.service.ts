import type { AxiosResponse } from "axios";
import type { DataShift } from "~/utils/constants/shift-interface";
import { useToast } from "vue-toastification";

const resDataHandler = (res: AxiosResponse) => {
  // console.log(res);
  const toast = useToast();
  switch (res?.status) {
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

const getAll = async (data: any): Promise<[DataShift] | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.post(
      `/schedule`,
      data,

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

const create = async (data: DataShift): Promise<DataShift | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.post(`/schedule/add`, data, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    return resDataHandler(error.response);
  }
};

const update = async (data: DataShift): Promise<DataShift | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.put(`/schedule/update/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    return resDataHandler(error.response);
  }
};

const copyPaste = async (copyDate: any, pasteDate: any): Promise<any> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.post(
      `/schedule/copypaste`,
      { copyDate, pasteDate },
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

const undoCopyPaste = async (copiedId: string): Promise<any> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.get(`/schedule/undoCopyPaste/${copiedId}`, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    return resDataHandler(error.response);
  }
};

const deleteOne = async (id: number): Promise<DataShift | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.delete(`/schedule/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    return resDataHandler(error.response);
  }
};

const ScheduleService = {
  getAll,
  create,
  deleteOne,
  update,
  copyPaste,
  undoCopyPaste,
};

export default ScheduleService;
