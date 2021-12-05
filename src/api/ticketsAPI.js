import axiosClient from "./index.js";

const ticketsAPI = {
    getTicket() {
        const url = "/tuyendung_phieuyeucaus";
        return axiosClient.get(url);
    },
    getPosition() {
        const url = "/caidats/12";
        return axiosClient.get(url);
    },
    postTicket(data) {
        const url = "/tuyendung_phieuyeucaus";
        return axiosClient.post(url, data);
    },
    updateTicket(data,id) {
        const url = `/tuyendung_phieuyeucaus/${id}`;
        console.log(data)
        return axiosClient.patch(url, data);
    }
};

export default ticketsAPI;