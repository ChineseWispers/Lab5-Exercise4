const friends = require('../models/friends')

const getFriends = (req, res) => {
  res.json(friends)
}

// filter endpoint, gets friends matching the gender from 'gender' query parameter ie. /friends/filter?gender=male
// 1. Add support to also filter by a starting 'letter' query parameter ie. /friends/filter?letter=R
const filterFriends = (req, res) => {
  console.log(req.query)
  let filterGender = req.query.gender;
  let filterStartingLetter = req.query.letter;
  let matchingFriends = [...friends];

  if (filterGender) {
      matchingFriends = matchingFriends.filter(friend => friend.gender == filterGender);
  }

  if (filterStartingLetter) {
      matchingFriends = matchingFriends.filter(friend => friend.name[0].toUpperCase() === filterStartingLetter.toUpperCase());
  }

  if (matchingFriends.length > 0) {
      // return valid data when the gender matches 
      res.status(200).json(matchingFriends)
  } else {
      // and an error response when there are no matches
      res.status(404).json({error: `No friends matching query parameter`})
}}

// 2. Get information about this request from the headers
const getInfo = (req, res) => {
  matchingHeaders = {}
  // Modify this response to just return info on the user-agent, content-type and accept headers
  // res.json(req.headers)
  for (let header in req.headers) {
      if (header === "accept" || header === "content-type" || header == "user-agent") {
          matchingHeaders[header] = req.headers[header]
      }}
  res.json(matchingHeaders)  
}

// 3. Dynamic request param endpoint - get the friend matching the specific ID ie. /friends/3
const friendById = (req, res) => {
    console.log(req.params)
    let friendId = req.params.id; // 'id' here will be a value matching anything after the / in the request path

    // Modify this function to find and return the friend matching the given ID, or a 404 if not found
    let friend = friends.find(friend => friend.id == friendId);

    // Modify this response with the matched friend, or a 404 if not found
    friend ? res.status(200).json({result:friend}) : res.status(404).json({result:`User ${friendID} not found`});
}

// a POST request with data sent in the body of the request, representing a new friend to add to our list
const postFriend = (req, res) => {
    let newFriend = req.body; // FIRST add this line to index.js: app.use(express.json());
    console.log(newFriend) // 'body' will now be an object containing data sent via the request body

    // we can add some validation here to make sure the new friend object matches the right pattern
    if (!newFriend.name || !newFriend.gender) {
        res.status(500).json({error: 'Friend object must contain a name and gender'});
        return;
    }
    else if (!newFriend.id) {
        newFriend.id = friends.length + 1; // generate an ID if one is not present
    }

    // if the new friend is valid, add them to the list and return the successfully added object
    friends.push(newFriend)
    res.status(200).json(newFriend)
}

// 4. Complete this new route for a PUT request which will update data for an existing friend
const putFriend = (req, res) => {
    let friendId = req.params.id;
    let updatedFriend = req.body;

    // Replace the old friend data for friendId with the new data from updatedFriend
    for (newData in updatedFriend) {
        friends[newData] = updatedFriend[newData]
    }

    // Modify this response with the updated friend, or a 404 if not found
    friends[friendId] ? res.status(200).json({result: 'Updated friend with ID ' + friendId, data: updatedFriend}) : 
    res.status(404).json({result:`Friend ${friendId} not found`})
}

exports.getFriends = getFriends;
exports.filterFriends = filterFriends;
exports.getInfo = getInfo;
exports.friendById = friendById;
exports.postFriend = postFriend;
exports.putFriend = putFriend;