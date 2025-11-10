import { BASE_URL } from "@/constants/baseUrl";
import { useProxyPhotoUrlQuery } from "@/store/api/uploadApi";
import axios from "axios";

export const useGetProxyUrl = async (url: string) => {
    const eurl =  encodeURIComponent("http://minio.aamardokan.online:9000/ffapp/1762778597554_upload-1762778596926.jpg");
    const photo = await axios.get(`${BASE_URL}/fileManager/photo-url/${eurl}`);
    // console.log("Proxy URL Data:",photo);

    return photo
    // return { data, error, isLoading, refetch };
}