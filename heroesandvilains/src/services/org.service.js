import axiosService from "./axios.service";
export default {
  getOrg() {
    return axiosService.get("/orgs/get");
  },
  createOrg(name, secret) {
    return axiosService.post("/orgs/create", {
      name: name,
      secret: secret,
    });
  },
  updateOrgAddTeam(orgSercret, idTeam) {
    return axiosService.patch(`/orgs/addteam?org-secret=${orgSercret}`, {
      idTeam: idTeam,
    });
  },
  updateOrgRemoveTeam(orgSercret,idTeam) {
    return axiosService.patch(`/orgs/removeteam?org-secret=${orgSercret}`, {
      idTeam: idTeam,
    });
  },

  getOrgById(orgSercret,id) {
    return axiosService.get(`/orgs/getbyid/${id}?org-secret=${orgSercret}`);
  },
};
