export const SidebarData = [
    {
        role_id: 1,
        task: [
            // { taskName: "Home", pathName: "/dashboard/admin" },
            { taskName: "Manage Active Members", pathName: "/dashboard/admin/getAllMember" },
            { taskName: "Manage Inactive Members", pathName: "/dashboard/admin/getAllInactiveMembers" },
            { taskName: "Manage Trainers", pathName: "/dashboard/admin/getAllTrainer" },
            { taskName: "Manage Packages", pathName: "/dashboard/admin/getAllPackages" },
            { taskName: "Manage Shifts", pathName: "/dashboard/admin/getAllShifts" },
            { taskName: "Read Queries", pathName: "/dashboard/admin/queryMessages" },
            { taskName: "Read Feedback", pathName: "/dashboard/admin/getfeedback" },
            { taskName: "Manage Profile", pathName: "/dashboard/admin/updateProfile" },
            { taskName: "Manage Password", pathName: "/dashboard/admin/updatePassword" },
            
        
        ],
    },
    {
        role_id: 2,
        task: [
            // { taskName: "Home", pathName: "/dashboard/trainer" },
            { taskName: "Manage Members", pathName: "/dashboard/trainer/getmystudents" },
            { taskName: "Manage Workout Type", pathName: "/dashboard/trainer/getWorkoutType"},
            { taskName: "Manage Diet Items", pathName: "/dashboard/trainer/getDietItems"},
            { taskName: "Manage BMI", pathName: "/dashboard/trainer/managebmi" },
            { taskName: "View Shifts", pathName: "/dashboard/trainer/getMyShifts"},
            { taskName: "Give Feedback", pathName: "/dashboard/trainer/giveFeedback" },
            { taskName: "Manage Profile", pathName: "/dashboard/trainer/updateProfile" },
            { taskName: "Manage Password", pathName: "/dashboard/trainer/updatePassword" },
        ],
    },
    {
        role_id: 3,
        task: [
            // { taskName: "Home", pathName: "/dashboard/member" },
            { taskName: "Manage Membership", pathName: "/dashboard/member/getMyPackage" },
            { taskName: "Manage Billing and Dues", pathName: "/dashboard/member/getMyBilling" },
            { taskName: "Get Transaction Records", pathName: "/dashboard/member/transactions" },
            { taskName: "View Diet Plan", pathName: "/dashboard/member/getDietPlan" },
            { taskName: "View Workout Plan", pathName: "/dashboard/member/viewWorkoutPlan" },
            { taskName: "View BMI Report", pathName: "/dashboard/member/getBmiReport" },
            { taskName: "View Shift", pathName: "/dashboard/member/getMyShift" },
            { taskName: "Give Feedback", pathName: "/dashboard/member/giveFeedback" },
            { taskName: "Manage Profile", pathName: "/dashboard/member/updateProfile" },
            { taskName: "Manage Password", pathName: "/dashboard/member/updatePassword" },
        ],
    },
];
