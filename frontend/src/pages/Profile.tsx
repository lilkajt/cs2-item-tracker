import React, { FormEvent, useState } from 'react';
import useAuthStore from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import ButtonConfirm from '@/components/ButtonConfirm';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { FiX } from "react-icons/fi";
import axios from 'axios';

const passRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

function Profile() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuthStore();
  const [values, setValues] = useState({
    curPassword: '',
    newPassword: '',
    confNewPassword: ''
  });
  const [errors,setErrors] = useState({
    curPassword: '',
    newPassword: '',
    confNewPassword: '',
    main: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleModal = () => {
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors( prev => ({
      ...prev,
      main: ''
    }));

    setValues( prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors( prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = { curPassword: '', newPassword: '', confNewPassword: '', main: ''};
    let isValid = true;

    if (!values.curPassword.trim()){
      newErrors.curPassword = "Don't forget your old password!";
      isValid = false;
    }

    if (values.newPassword !== values.confNewPassword){
      newErrors.newPassword = "Passwords must match.";
      newErrors.confNewPassword = "Passwords must match.";
      isValid = false;
    }
    if (values.curPassword === values.newPassword){
      newErrors.newPassword = "New password must be different.";
      isValid = false;
    }
    if (!passRegex.test(values.newPassword)){
      newErrors.newPassword = "Too weak. Try a stronger password.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      await axios.put(`/api/user/update/${user?._id}`, {
        curPassword: values.curPassword,
        newPassword: values.newPassword,
        confNewPassword: values.confNewPassword
      })
      .then( response => {
        if (response.data && response.data.success) {
          setLoading(false);
          setSuccess(response.data.message);
          setCountdown(5);
          const timer = setInterval(() => {
            setCountdown(prevCount => {
              if (prevCount === 1) {
                clearInterval(timer);
                handleCloseModal();
                return null;
              }
              return prevCount - 1;
            });
          }, 1000);
        }
      })
      .catch( error => {
        setLoading(false);
        if (error.response && error.response.data){
          setErrors(prev => ({
            ...prev,
            main: error.response.data.message || "Oops! Couldn't complete that. Try again?"
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            main: "Oops! Couldn't complete that. Try again?"
          }));
        }
      });
    }
  };

  const handleCloseModal = () => {
    setValues({
      curPassword: '',
      newPassword: '',
      confNewPassword: ''
    });
    setErrors({
      newPassword: '',
      curPassword: '',
      confNewPassword: '',
      main: ''
    })
    setSuccess("");
    setCountdown(null);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center w-full px-10 py-5 gap-15'>
        <div className="flex flex-col gap-10 pb-10">
          <div className='w-72'>
            <span className='block text-sm font-medium text-beige-100 h-8'>Your email</span>
            <div className="flex items-center h-10 text-beige-200 font-normal cursor-not-allowed bg-green-500 text-lg px-3 py-2 outline-2 outline-green-300 rounded-lg select-none">
              <span className='leading-3.5 text-3xl md:text-2xl'>
              {isLoggedIn ? user?.email: ""}
              </span>
            </div>
          </div>
          <div className='w-72'>
            <span className='block text-sm font-medium text-beige-100 h-8'>Your login</span>
            <div className="flex items-center h-10 text-beige-200 font-normal cursor-not-allowed bg-green-500 text-lg px-3 py-2 outline-2 outline-green-300 rounded-lg select-none">
              <span className='leading-3.5 text-3xl md:text-2xl'>
              {isLoggedIn ? user?.username: ""}
              </span>
            </div>
          </div>
        </div>
        <div className='w-72 flex gap-13 flex-col'>
          <ButtonConfirm type='button' onClick={handleModal} >Change password</ButtonConfirm>
          <ButtonConfirm type='button' onClick={handleLogout} className='bg-green-400'>Logout</ButtonConfirm>
        </div>
      </div>
      <Modal
      open={open}
      onClose={() => setOpen(false)}
      >
        <div className='flex flex-col justify-center items-center pt-30 px-10 gap-10'>
          <form id='updatePass' className='flex flex-col gap-8 items-center px-10 justify-center'>
            <div className="w-72 text-start">
              <Input
              placeholder="Enter current password"
              name="curPassword"
              onChange={handleChange}
              type='password'
              value={values.curPassword}
              className={errors.curPassword ? "outline-red text-red" : ""}
              />
              { errors.curPassword && <p className="text-red mt-3">{errors.curPassword}</p>}
            </div>
            <div className="w-72 text-start">
              <Input
              placeholder="Enter new password"
              name="newPassword"
              onChange={handleChange}
              type='password'
              value={values.newPassword}
              className={errors.newPassword ? "outline-red text-red" : ""}
              />
              { errors.newPassword && <p className="text-red mt-3">{errors.newPassword}</p>}
            </div>
            <div className="w-72 text-start">
              <Input
              placeholder="Confirm new password"
              name="confNewPassword"
              onChange={handleChange}
              type='password'
              value={values.confNewPassword}
              className={errors.confNewPassword ? "outline-red text-red" : ""}
              />
              { errors.confNewPassword && <p className="text-red mt-3">{errors.confNewPassword}</p>}
            </div>
          </form>
          <div className="flex flex-row gap-5 w-72">
            <ButtonConfirm
            onClick={handleUpdatePassword}
            id='updatePass'
            className={loading ? "bg-green-400 text-green-200 pt-1 cursor-not-allowed!": "pt-1"}
            disabled={loading}
            >
              Update
            </ButtonConfirm>
            <button
            onClick={handleCloseModal}
            className='flex items-center justify-center outline-2 outline-green-500 bg-midnight w-[60%] h-12 text-beige-200 rounded-lg text-3xl cursor-pointer'
            >
              <FiX />
            </button>
          </div>
          {success && 
            <div className="text-green-300 text-lg">{success}{ countdown && ` Closing in ${countdown}s`}</div>
          }
          {errors.main && 
            <div className="w-72 text-red text-lg">{errors.main}</div>
          }
        </div>
      </Modal>
    </>
  )
}

export default Profile;