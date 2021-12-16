import axiosClient from "./index.js";

const candidatesAPI = {
    getCandidate() {
        const url = "/hrms/tuyendung_hosos?filter[published]=0&page[limit]=*";
        return axiosClient.get(url);
    },
    postCandidate(data) {
        const url = "/hrms/tuyendung_hosos";
        return axiosClient.post(url, data);
    },
    updateCandidate(data, id) {
        const url = `/hrms/tuyendung_hosos/${id}`;
        return axiosClient.patch(url, data);
    }
};

export default candidatesAPI;