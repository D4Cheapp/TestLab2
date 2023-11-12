'use client';
import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { profileLogin, profileRegister, setErrorsState } from '@/src/reduxjs/reducers/testReducer';
import { entryFormType } from '@/src/types/formTypes';
import { useAppDispatch, useAppSelector } from '@/src/hooks/reduxHooks';
import { InputContainer } from './InputContainer';
import styles from './EntryForm.module.scss';

interface EntryFormInterface {
  redirectTo: string;
  title: string;
  submitTitle: string;
  redirectTitle: string;
  isRegister?: boolean;
}

function EntryForm({
  redirectTo,
  title,
  submitTitle,
  redirectTitle,
  isRegister = false,
}: EntryFormInterface) {
  const { register, handleSubmit, formState } = useForm<entryFormType>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const currentProfile = useAppSelector((state) => state.test.currentProfile);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onShowPasswordClick = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const onShowConfirmPasswordClick = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword);
  }, [showConfirmPassword]);

  const onSubmitFunc: SubmitHandler<entryFormType> = (data, event) => {
    event?.preventDefault();
    const valuesArray = Object.values(data).map((value) =>
      typeof value === 'string' ? (!!value.trim() ? value : undefined) : value,
    );

    if (valuesArray.includes(undefined)) {
      dispatch(setErrorsState('Error: Fill in all the necessary data'));
      return false;
    }

    if (isRegister && data.password !== data.password_confirmation) {
      dispatch(setErrorsState('Error: Passwords don\'t match'));
      return false;
    }

    // @ts-ignore
    dispatch(isRegister ? profileRegister(data) : profileLogin(data));
    return true;
  };

  const onRedirectClick = () => {
    router.push(redirectTo);
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful && currentProfile?.id) {
      router.push('/');
    }
  }, [currentProfile?.id, formState.isSubmitSuccessful, router]);

  return (
    <div className={styles.formContainer}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className={styles.form} onSubmit={handleSubmit(onSubmitFunc)} name="EntryForm">
        <h1 className={styles.title}>{title}</h1>

        <InputContainer title="Логин" name="username" register={register} isPassword={false} />

        <InputContainer
          isPassword
          title="Пароль"
          name="password"
          register={register}
          isShownPassword={showPassword}
          onShowPasswordClick={onShowPasswordClick}
        />

        {isRegister && (
          <>
            <InputContainer
              isPassword
              title="Подтвердите пароль"
              name="password_confirmation"
              register={register}
              isShownPassword={showConfirmPassword}
              onShowPasswordClick={onShowConfirmPasswordClick}
            />

            <label className={styles.isAdmin}>
              <p className={styles.isAdminTitle}>Учетная запись администратора</p>

              <input
                className={styles.checkbox}
                type="checkbox"
                defaultChecked={false}
                {...register('is_admin')}
              />

              <div className={styles.customCheckbox} />
            </label>
          </>
        )}

        <div className={styles.additionalContent}>
          <button className={styles.submit} type="submit">
            {submitTitle}
          </button>

          <button type="button" className={styles.redirectLink} onClick={onRedirectClick}>
            {redirectTitle}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EntryForm;
