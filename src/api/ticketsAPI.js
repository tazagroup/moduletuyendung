import axiosClient from "./index.js";

const ticketsAPI = {
    getTicket() {
        const url = "/hrms/tuyendung_phieuyeucaus?filter[published]=0";
        return axiosClient.get(url);
    },
    getUser() {
        const url = "/users?&page[offset]=0&page[limit]=*";
        return axiosClient.get(url);
    },
    getPosition() {
        const url = "/hrms/caidats/12";
        return axiosClient.get(url);
    },
    postTicket(data) {
        const url = "/hrms/tuyendung_phieuyeucaus";
        return axiosClient.post(url, data);
    },
    updateTicket(data, id) {
        const url = `/hrms/tuyendung_phieuyeucaus/${id}`;
        return axiosClient.patch(url, data);
    }
};

export default ticketsAPI;