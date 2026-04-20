const User = require("../../models/user.model");

const userService = {

    find : async(query) => {
        try {

            const { search } = query;

            let searchFilter;
            let firstnameFilter;
            let lastnameFilter;

            if(!search) {

                firstnameFilter = {};
                lastnameFilter = {};

            }else {
                searchFilter = { $regex : new RegExp(search, 'i')};
                // new RegExp(search, 'i') va créer une regex
                // ex : si dans ma search il y a "au" -> /au/i

                firstnameFilter = { firstname : searchFilter };
                // { firstname : { $regex : new RegExt(search, 'i') } }
                lastnameFilter = { lastname : searchFilter };
                // { lastname : { $regex : new RegExt(search, 'i') } }

            }

            console.log(firstnameFilter);
            console.log(lastnameFilter);
            
            const users = await User.find()
            .or([firstnameFilter, lastnameFilter])
            .select(['_id', 'firstname', 'lastname', 'role', 'createdAt', 'updatedAt']);
            return users;

        }catch(err){
            throw new Error(err);
        }
    }
}

module.exports = userService;