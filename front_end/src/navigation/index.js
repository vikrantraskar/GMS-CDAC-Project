import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Dashboard from '../screens/Dashboard';
import AdminDashboard from '../screens/Dashboard/Admin';
import UpdatePassword from '../screens/Dashboard/Admin/ManageAccount/updatePassword';
import UpdateProfile from '../screens/Dashboard/Admin/ManageAccount/updateProfile';
import AssignTrainerToSpecificMember from '../screens/Dashboard/Admin/manageMembers/assignTrainer';
import ManagePackages from '../screens/Dashboard/Admin/managePackages/getAllPackages';
import ManageShifts from '../screens/Dashboard/Admin/manageShifts/manageAllShifts';
import GetAllTrainer from '../screens/Dashboard/Admin/manageTrainers/getAllTrainer';
import UpdateTrainerSalary from '../screens/Dashboard/Admin/manageTrainers/updateSalary';
import MemberDashboard from '../screens/Dashboard/Member';
import PayDues from '../screens/Dashboard/Member/Billing Due/payDues';
import GetMemberSpecificBmi from '../screens/Dashboard/Member/getBMI/getBmiReport';
import UpdateMemberPassword from '../screens/Dashboard/Member/ManageAccount/updatePassword';
import UpdateMemberProfile from '../screens/Dashboard/Member/ManageAccount/updateProfile';
import GetDietPlan from '../screens/Dashboard/Member/myDietplan/getDietPlan';
import GetAllPackages from '../screens/Dashboard/Member/myPackages/addNewPackage';
import GetMemberPackages from '../screens/Dashboard/Member/myPackages/getMypackages';
import GetMyShift from '../screens/Dashboard/Member/myShifts/getShifts';
import GetMyTransactions from '../screens/Dashboard/Member/myTransactions/getMyTransactions';
import TrainerDashboard from '../screens/Dashboard/Trainer';
import UpdateTrainerPassword from '../screens/Dashboard/Trainer/ManageAccount/updatePassword';
import GetDietItemList from '../screens/Dashboard/Trainer/manageDiet/getDietItem';
import LandingPage from '../screens/Landing-Page';
import SigninPage from '../screens/Signin-Page';
import SignupPage from '../screens/Signup-Page';
import GetWorkoutType from '../screens/Dashboard/Trainer/manageWorkoutPlan/getWorkoutType';
import GetAllShiftOfSpecificTrainer from '../screens/Dashboard/Admin/manageTrainers/getAllShiftsOfSpecificTrainer';
import UpdateTrainerProfile from '../screens/Dashboard/Trainer/ManageAccount/updateProfile';
import ApplyForMembership from '../screens/Dashboard/Member/applyForMembership/applyMembership';
import AddPackages from '../screens/Dashboard/Member/myPackages/addNewPackage';
import GetAllMember from '../screens/Dashboard/Admin/manageMembers/getAllMembers';
import GetMyStudents from '../screens/Dashboard/Trainer/myStudents/getMyStudents';
import AddWorkoutPlan from '../screens/Dashboard/Trainer/manageWorkoutPlan/addWorkoutPlan';
import UpdateDietPlanForSpecificUser from '../screens/Dashboard/Trainer/manageDiet/updateDietPlan';
import CreateDietPlanForSpecificUser from '../screens/Dashboard/Trainer/manageDiet/createDietPlan';
import ManageBmi from '../screens/Dashboard/Trainer/getBMI/getBmiReport';
import CreateBmiReport from '../screens/Dashboard/Trainer/getBMI/createBmiReport';
import UpdateBmiReport from '../screens/Dashboard/Trainer/getBMI/updateBmiReport';
import GetAllInactiveMember from '../screens/Dashboard/Admin/manageInactiveMember/getAllInactiveMembers';
import AssignShiftToSpecificTrainer from '../screens/Dashboard/Admin/manageTrainers/assignShiftToSpecificTrainer';
import ProtectedRoute from './protectedRoute';
import GroupTraning from '../screens/Package-Screen/groupTraining';
import YogaTraning from '../screens/Package-Screen/yogaTraining';
import ZumbaTraning from '../screens/Package-Screen/zumbaTraning';
import PersonalTraning from '../screens/Package-Screen/personalTraining';
import AboutUs from '../screens/AboutUs/aboutUs';
import ContactUs from '../screens/ContactUs/contactus';
import GiveFeedback from '../screens/Dashboard/Member/FeedbackM/giveFeedback';
import GiveFeedbackT from '../screens/Dashboard/Trainer/FeedbackT/giveFeedback';
import MembersFeedback from '../screens/Dashboard/Admin/Feedback/getfeedback';
import QueryMessages from '../screens/Dashboard/Admin/generalquery/queryMessages';
import GetMyShiftOfSpecificTrainer from '../screens/Dashboard/Trainer/myShifts/getMyShifts';
import ViewWorkoutPlan from '../screens/Dashboard/Member/myWorkoutPlan/viewWorkoutPlan'

const Navigator = () => {
    return(
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/aboutus" element={<AboutUs/>} />
            <Route path="/contactus" element={<ContactUs/>} />
            <Route path="/personaltraining" element={<PersonalTraning/>} />
            <Route path="/zumbatraining" element={<ZumbaTraning/>} />
            <Route path="/grouptraining" element={<GroupTraning/>} />
            <Route path="/yogatraining" element={<YogaTraning/>} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />}>

                {/* all admin route */}
                <Route path='admin' element={<ProtectedRoute path='admin' screen={GetAllMember} />}/>
                <Route path='admin/getAllMember' element={<ProtectedRoute path='admin/getAllMember' screen={GetAllMember} />}/>
                <Route path='admin/GetAllInactiveMembers' element={<ProtectedRoute path='admin/GetAllInactiveMembers' screen={GetAllInactiveMember} />}/>
                <Route path='admin/getAllTrainer' element={<ProtectedRoute path='admin/getAllTrainer' screen={GetAllTrainer} />}/>
                <Route path='admin/assignShiftToSpecificTrainer' element={<ProtectedRoute path='admin/assignShiftToSpecificTrainer' screen={AssignShiftToSpecificTrainer} />}/>
                <Route path='admin/getAllShiftofAllTrainers' element={<ProtectedRoute path='admin/getAllShiftofAllTrainers' screen={GetAllShiftOfSpecificTrainer} />}/>
                <Route path='admin/getAllTrainer/updateSalary' element={<ProtectedRoute path='admin/getAllTrainer/updateSalary' screen={UpdateTrainerSalary} />}/>
                <Route path='admin/assignTrainer' element={<ProtectedRoute path='admin/assignTrainer' screen={AssignTrainerToSpecificMember} />}/>
                <Route path='admin/getAllPackages' element={<ProtectedRoute path='admin/getAllPackages' screen={ManagePackages} />}/>
                <Route path='admin/getAllShifts' element={<ProtectedRoute path='admin/getAllShifts' screen={ManageShifts} />}/>
                <Route path='admin/queryMessages' element={<ProtectedRoute path='admin/queryMessages' screen={QueryMessages} />}/>
                <Route path='admin/getfeedback' element={<ProtectedRoute path='admin/getfeedback' screen={MembersFeedback} />}/>
                <Route path='admin/updateProfile' element={<ProtectedRoute path='admin/updateProfile' screen={UpdateProfile} />}/>
                <Route path='admin/updatePassword' element={<ProtectedRoute path='admin/updatePassword' screen={UpdatePassword} />}/>

                {/* all trainers route */}
                <Route path='trainer' element={<ProtectedRoute path='trainer' screen={GetMyStudents} />} />
                <Route path='trainer/getWorkoutType' element={<ProtectedRoute path='trainer/getWorkoutType' screen={GetWorkoutType} />}/>
                <Route path='trainer/getDietItems' element={<ProtectedRoute path='trainer/getDietItems' screen={GetDietItemList} />}/>
                <Route path='trainer/getMyShifts' element={<ProtectedRoute path='trainer/getMyShifts' screen={GetMyShiftOfSpecificTrainer} />}/>
                <Route path='trainer/updateProfile' element={<ProtectedRoute path='trainer/updateProfile' screen={UpdateTrainerProfile} />}/>
                <Route path='trainer/updatePassword' element={<ProtectedRoute path='trainer/updatePassword' screen={UpdateTrainerPassword} />}/>
                <Route path='trainer/getmystudents' element={<ProtectedRoute path='trainer/getmystudents' screen={GetMyStudents} />}/>
                <Route path='trainer/getmystudents/createDietPlan' element={<ProtectedRoute path='rainer/getmystudents/createDietPlan' screen={CreateDietPlanForSpecificUser} />}/>
                <Route path='trainer/getmystudents/updateDietPlan' element={<ProtectedRoute path='trainer/getmystudents/updateDietPlan' screen={UpdateDietPlanForSpecificUser} />}/>
                <Route path='trainer/getmystudents/addWorkoutPlan' element={<ProtectedRoute path='trainer/getmystudents/addWorkoutPlan' screen={AddWorkoutPlan} />}/>
                <Route path='trainer/managebmi' element={<ProtectedRoute path='trainer/managebmi' screen={ManageBmi} />}/>
                <Route path='trainer/createbmi' element={<ProtectedRoute path='trainer/createbmi' screen={CreateBmiReport} />}/>
                <Route path='trainer/updatebmi' element={<ProtectedRoute path='trainer/updatebmi' screen={UpdateBmiReport} />}/>
                <Route path='trainer/giveFeedback' element={<ProtectedRoute path='trainer/giveFeedback' screen={GiveFeedbackT} />}/>


                {/* all member route */}
                <Route path='member' element={<ProtectedRoute path='member' screen={GetMemberPackages} />} />
                <Route path='member/getDietPlan' element={<ProtectedRoute path='member/getDietPlan' screen={GetDietPlan} />}/>
                <Route path='member/viewWorkoutPlan' element={<ProtectedRoute path='member/viewWorkoutPlan' screen={ViewWorkoutPlan} />}/>
                <Route path='member/getMyPackage' element={<ProtectedRoute path='member/getMyPackage' screen={GetMemberPackages} />}/>
                <Route path='member/getMyBilling' element={<ProtectedRoute path='member/getMyBilling' screen={PayDues} />}/>
                <Route path='member/addPackage' element={<ProtectedRoute path='member/addPackage' screen={AddPackages} />}/>
                <Route path='member/transactions' element={<ProtectedRoute path='member/transactions' screen={GetMyTransactions} />}/>
                <Route path='member/updateProfile' element={<ProtectedRoute path='member/updateProfile' screen={UpdateMemberProfile} />}/>
                <Route path='member/updatePassword' element={<ProtectedRoute path='member/updatePassword' screen={UpdateMemberPassword} />}/>
                <Route path='member/getBmiReport' element={<ProtectedRoute path='member/getBmiReport' screen={GetMemberSpecificBmi} />}/>
                <Route path='member/getMyShift' element={<ProtectedRoute path='member/getMyShift' screen={GetMyShift} />}/>
                <Route path='member/membership' element={<ProtectedRoute path='member/membership' screen={ApplyForMembership} />}/>
                <Route path='member/giveFeedback' element={<ProtectedRoute path='member/giveFeedback' screen={GiveFeedback} />}/>
                
                {/* if we try to match dashboard further route and they doesnot exist then it will go back to dashboard page */}
                <Route path='*' element={<Navigate replace to="/dashboard" />} />
            </Route>
            {/* if path which is not match with all existing route it will simply navigate to landing page */}
            <Route path="*" element={<Navigate replace to="" />} />
        </Routes>
    );
}

export default Navigator;