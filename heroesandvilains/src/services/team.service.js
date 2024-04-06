import axiosService from "./axios.service";
export default {
  getTeams() {
    return axiosService.get("/teams/get");
  },
  createTeam(teamName) {
    return axiosService.post("/teams/create", {
      name: teamName,
    });
  },
  updateTeamAddHeroes(teamId, addheroes) {
    return axiosService.patch("/teams/addheroes", {
      idHeroes: addheroes,
      idTeam: teamId,
    });
  },
  updateTeamRemoveHeroes(teamId, addheroes) {
    return axiosService.patch(`/teams/removeheroes`, {
      idHeroes: addheroes,
      idTeam: teamId,
    });
  },
};
