import axiosClient from "./index.js";

const ticketsAPI = {
    getTicket() {
        const url = "/hrms/tuyendung_phieuyeucaus?filter[published]=0";
        return axiosClient.get(url);
    },
    getUser() {
        const url = "/users";
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
        console.log(data)
        return axiosClient.patch(url, data);
    }
};

export default ticketsAPI;