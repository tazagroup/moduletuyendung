import axiosClient from "./index.js";

const noticesAPI = {
    getSettings() {
        const url = "/hrms/caidats/32"
        return axiosClient.get(url)
    },
    getNotices() {
        const url = "/hrms/notifications?filter[published]=0&page[offset]=0&page[limit]=*"
        return axiosClient.get(url)
    },
    postNotice(data) {
        const url = "/hrms/notifications";
        return axiosClient.post(url, data);
    },
    updateNotice(data) {
        const url = `/hrms/notifications/${data.id}`;
        return axiosClient.patch(url, data);
    }
};

export default noticesAPI;