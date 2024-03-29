    import axiosService from "./axios.service";
    export default {
    getHeroes() {
        return axiosService.get("/heroes/getaliases");
    },
    createHero(publicName, realName, powers) {
        return axiosService.post("/heroes/create", {
        publicName: publicName,
        realName: realName,
        powers: powers,
        });
    },
    updateHero(id, publicName, realName, powers,orgSecret) {
        return axiosService.put(`/heroes/update?org-secret=${orgSecret}`, {
        _id: id,
        publicName: publicName,
        realName: realName,
        powers: powers,
        });
    },
    getHeroById(secret,id) {
        return axiosService.get(`/heroes/getbyid/${id}?org-secret=${secret}`);
    },
    };
