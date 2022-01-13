import axiosClient from "./index.js";

const guidesAPI = {
    getGuides() {
        const url = "/hrms/huongdans"
        return axiosClient.get(url)
    },
    getStatus(){
        const url = "/hrms/caidats/34"
        return axiosClient.get(url)
    },
    postGuides(data) {
        const url = "/hrms/huongdans"
        return axiosClient.post(url, data)
    },
    updateGuide(data, id) {
        const url = `hrms/huongdans/${id}`
        return axiosClient.patch(url, data)
    },
};

export default guidesAPI;