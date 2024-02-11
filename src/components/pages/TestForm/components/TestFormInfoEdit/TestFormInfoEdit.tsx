import React, { Dispatch, SetStateAction, useContext } from 'react';
import cn from 'classnames';
import { Field, useFormikContext } from 'formik';
import ModalWindow from '@/src/components/common/ModalWindow';
import ModalQuestionForm from '../ModalQuestionForm';
import { TestFormContext } from '../../TestFormContext';
import s from './TestFormInfoEdit.module.scss';

interface Props {
  onAddQuestionClick: () => void;
  modalWindowData: {
    isAddQuestionWindowActive: boolean;
    setIsAddQuestionWindowActive: Dispatch<SetStateAction<boolean>>;
  };
}

const TestFormInfoEdit = ({ onAddQuestionClick, modalWindowData }: Props): React.ReactNode => {
  const { withDeleteButton, onQuestionModifyClick, setCurrentQuestion } =
    useContext(TestFormContext);
  const { resetForm } = useFormikContext();

  const handleCloseAddWindowAction = () => {
    modalWindowData.setIsAddQuestionWindowActive(false);
    setCurrentQuestion(undefined);
    resetForm();
  };

  return (
    <div
      className={cn(s.editContainer, {
        [s.singleContainer]: withDeleteButton,
      })}
    >
      <div
        className={cn(s.contentContainer, {
          [s.mainInput]: withDeleteButton,
        })}
      >
        <h2 className={s.testNameTitle}>Название теста</h2>
        <Field
          className={s.testNameInput}
          type="text"
          readOnly={withDeleteButton}
          placeholder="Введите название теста"
          name="testTitle"
          id="testTitle"
        />
      </div>
      {!withDeleteButton && (
        <div className={s.contentContainer}>
          <h2 className={s.testNameTitle}>Добавление вопроса</h2>
          <div className={s.chooseQuestionContainer}>
            <Field className={s.questionType} as="select" name="questionType">
              <option className={s.questionTypeOption} value="">
                Выберите тип вопроса
              </option>
              <option className={s.questionTypeOption} value="single">
                Один из списка
              </option>
              <option className={s.questionTypeOption} value="multiple">
                Несколько из списка
              </option>
              <option className={s.questionTypeOption} value="number">
                Численный ответ
              </option>
            </Field>
            {modalWindowData.isAddQuestionWindowActive && (
              <ModalWindow
                title="Добавление вопроса"
                setIsActive={handleCloseAddWindowAction}
                onConfirmClick={() => onQuestionModifyClick(false)}
                buttonInfo={{ confirmTitle: 'Сохранить', withConfirmButton: true }}
              >
                <ModalQuestionForm />
              </ModalWindow>
            )}
            <button type="button" className={s.addButton} onClick={onAddQuestionClick}>
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestFormInfoEdit;
