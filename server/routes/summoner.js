module.exports = function(req, res) {
   let summonerName = req.params.summonerName;
   // look up summoner name in database for summoner stats
   res.send({message: summonerName});
};
