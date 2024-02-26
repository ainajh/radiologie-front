import type { AxiosResponse } from "axios";
import type { DataShift } from "~/utils/constants/shift-interface";

const resDataHandler = (res: AxiosResponse) => {
  // console.log(res);
  switch (res.status) {
    case 200: {
      return res.data?.data;
    }
    case 201: {
      return res.data?.data;
    }
    default: {
      return res.data;
    }
  }
};

const getAll = async (): Promise<[DataShift] | undefined> => {
  try {
    const { $api } = useNuxtApp();
    const response = await $api?.get(`/schedule`, {
      headers: {
        Authorization: `Bearer ${useCookie("token").value}`,
      },
    });

    return resDataHandler(response);
  } catch (error: any) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
  }
};

const copyPaste = async (
  copyDate: any,
  pasteDate: any
): Promise<DataShift[] | undefined> => {
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
    console.log(error);
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
    console.log(error);
  }
};

const ScheduleService = {
  getAll,
  create,
  deleteOne,
  update,
  copyPaste,
};

export default ScheduleService;
