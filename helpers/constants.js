module.exports = {
    userStatus: {
        INACTIVE: 0,
        ACTIVE: 1,
        VERIFICATION_PENDING: 2,
        VERIFICATION_FAILED: 3,
    },
    paymentStatus: {
        PENDING: 1,
        SUCCESS: 2,
        FAILED: 3,
        DISPUTE: 4,
        REFUND: 5,
    },
    userType: {
        CLIENT: 1,
        SERVICEPROVIDER: 2
    },

    transactionType: {
        DEBIT: 1,
        CREDIT: 2
    },
    settingType: {
        TERMS_AND_CONDITIONS: 1
    },
    commonStatus: {
        INACTIVE: 0,
        ACTIVE: 1
    },
    deviceType: {
        ANDROID: 1,
        IOS: 2,
        WEB: 3
    },
    bankAccountVerificationStatus: {
        PENDING: 1,
        VERIFIED: 2,
        REJECTED: 3
    },
    transactionCategory: {
        WTW: 1,
        MMP: 2,
        GOALS: 3,
        SERVICE: 4,
        WITHDRAW: 5,
        PAYMENT_GATEWAY: 6,
        TEMP_TOP_UP: 7,
        PAYOUT: 8
    },

    moneyRequestStatus: {
        PENDING: 1,
        ACCEPTED: 2,
        REJECTED: 3,
        CANCELLED: 4,
        BLOCKED_BY_RECEIVER: 5,
        EXPIRED: 6
    },
    notificationStatus: {
        PENDING: 1,
        SENT: 2,
        FAILED: 3
    },
 
 
    invitationStatus: {
        PENDING: 1,
        ACCEPTED: 2
    },

    shopColorType: {
        GREEN: 1,
        PINK: 2,
        PURPLE: 3
    },
    kycStatus: {
        PENDING: 1,
        VERIFIED: 2,
        REJECTED: 3
    },
    interestRate: {
        INTEREST_RATE: 0.05
    },
    serviceProvider: {
        SEEG: 1,
        CANAL: 2,
        SATCON: 3,
        MOOV_BOX: 4,
        CANAL_BOX: 5
    },
    serviceType: {
        MOBILE_RECHARGE: 1,
        ELECTRICITY_BILL: 2,
        WATER_BILL: 3,
        CABLE_RECHARGE: 4,
        INTERNET_RECHARGE: 5
    },
    serviceAssociation: {
        ELECTRICITY_BILL: [1],
        WATER_BILL: [1],
        CABLE_RECHARGE: [2, 3],
        INTERNET_RECHARGE: [4, 5]
    },
    billType: {
        NONE:0,
        ELECTRICITY_BILL: {
            EDAN: 1,
            OTHER: 2,
        },
    },
    billRecurringStatus:{
        PENDING:0,
        PAID:1,
        FAIL:2
    },

    adminRole: {
        ADMIN: 1,
        SUPERADMIN: 2
    },
    managerPermission: {
        DASHBOARD: 1,
        USERS: 2,
        TRANSACTIONS: 3,
        GOALS: 4,
        NOTIFICATION: 5,
        USER_WAIT_LIST: 6,
        MANAGER_LIST: 7,
        USER_STATUS_UPDATE: 8,
        KYC_UPDATE_STATUS: 9,

    },
    language:{
        FRENCH: 1,
        ENGLISH: 2
    },
    identityTypes:{
        HEALTH_CARD: 1,
        PASSPORT: 2,
        TRAVEL_DOC: 3,
        IDENTITY_CARD: 4,
        RESIDENT_ID: 5,
        OTHERS: 6
    },
    allPermssions: {
        "Dashboard": 1,
        "Users": 2,
        "Transactions": 3,
        "Goals": 4,
        "Notification": 5,
        "User wait list": 6,
        "Manager list": 7,
        "User status update": 8,
        "Kyc update status": 9,

    },
    viewOrEditUrls: {
        '/admin/dashboard': 1,
        '/admin/user/csv/list': 2,
        '/admin/user-list': 2,
        '/admin/goals/goal-list': 4,
        '/admin/manager/list': 7,
        '/admin/transaction-list': 3,
        '/admin/transaction/csv/list': 3,
        '/admin/referral/users': 6,
        '/admin/update/user-status': 8,
        '/admin/update/user-kyc': 9,
        '/admin/promotional-notification': 5
    },
    editUrl: {
        '/admin/goal/status': 4,
        '/admin/user/lead': 2,
        '/admin/update/user-status': 2,
        '/admin/promotional-notification': 5
    }
}