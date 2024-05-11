
const bcrypt = require('bcrypt');


class Helpers {

    generateRandomOTP(min ,max) {

        const bytes = crypto.randomBytes(4); // 4 bytes for a 32-bit integer
        const randomInt = bytes.readUInt32LE(0); // Convert bytes to an integer
        return Math.floor(randomInt / 0xFFFFFFFF * (max - min + 1) + min);
      }

    getErrorMessage([req, res], error = null) {
        res.status(422).json({
            "status": "fail",
            "response": error ? error : "Something went wrong",
        });
    }

    // getSuccesMessage(res, data = null, extras = null) {
    //     // res.status(200).json({
    //     //     "status": "success",
    //     //     "response": data ? data : "Request process succesfully",
    //     // });

    //     let response = {
    //         status: 200,
    //         response: data ? data : "Request process successfully",
    //     }

    //     if (extras) {
    //         response = {
    //             ...response,
    //             ...extras
    //         }
    //     }

    //     res.status(200).json(response);

    // }


    getSuccessMessage([req, res], data = null, customObj = null) {
        let response = {
            "status": 200,
            "response": data ? data : 'request_process_successfully'
        }
        if (customObj) {
            response = { ...response, ...customObj }
        }
        return res.status(200).json(response);
    }


    getAuthErrorMessage(res, data = null) {
        return res.status(401).json({
            "status": "fail",
            "response": "Unauthorized"
        });
    }

    getValidationErrorMessage([req, res], data = null) {
        console.log(data);
  
        let response = {
            "status": "fail",
            "response": data ? data : req.t('invalid_parameters')
        }
        return res.status(400 ).json(response);
    }

    generateToken(email) {
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign({
            _id: email,
            //  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), /// 30 Days
        }, secret).toString();
        return token;
    };

    async verifyToken(token) {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        const now = Date.now().valueOf() / 1000;
        if (!decoded) {
            throw new Error(locale.unAuthorized)
        }

        const isUser = await UserModel.findOne({
            where: {
                email: decoded._id,
                token: token
            }
        })

        if (!isUser) {
            throw new Error(locale.unAuthorized)
        }
        return isUser;
    }

    async verifyAdminToken(token) {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        if (!decoded) {
            throw new Error(locale.unAuthorized)
        }

        const isAdmin = await AdminModel.findOne({
            where: {
                email: decoded._id,
                token: token
            },
            // include: ["department"]
        })

        if (!isAdmin) {
            throw new Error(locale.unAuthorized)
        }
        // isAdmin.department = isAdmin.department ? isAdmin.department.department : null;
        return isAdmin;

    }

    hashString(string) {
        let saltRounds = 10;
        return bcrypt.hashSync(string, saltRounds);
    }

}

module.exports = new Helpers();