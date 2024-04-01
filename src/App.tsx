import { SubmitHandler, useForm } from "react-hook-form"
import arrowLeft from '../src/assets/icons/arrow-left.svg'
import arrowRight from '../src/assets/icons/arrow-right.svg'
import { useEffect, useState } from "react";

interface IFormInput {
  id: number;
  fullName: string
  email: string
  address: string
  city: string
  country: string
}

const headers = Array.of("FULL NAME", "EMAIL ADDRESS", "ADDRESS", "COUNTRY", "ACTION");

function App() {
  const [listUserInfo, setListUserInfo] = useState<IFormInput[]>([]);
  const [modeEdit, setModeEdit] = useState(false)
  const formOptions = { defaultValues: { fullName: '', email: '', address: '', city: '' } };

  //Paging
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [indexOfLastRecord, setIndexOfLastRecord] = useState(currentPage * recordsPerPage);
  const [indexOfFirstRecord, setIndexOfFirstRecord] = useState(indexOfLastRecord - recordsPerPage);
  const [currentRecords, setCurrentRecords] = useState(listUserInfo.slice(indexOfFirstRecord, indexOfLastRecord))

  const goToNextPage = () => {
    const nPages = Math.ceil(listUserInfo.length / recordsPerPage)
    if (currentPage !== nPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1)
  }

  useEffect(() => {
    setIndexOfLastRecord(currentPage * recordsPerPage)
    setIndexOfFirstRecord(indexOfLastRecord - recordsPerPage)
    setCurrentRecords(listUserInfo.slice(indexOfFirstRecord, indexOfLastRecord))
  }, [currentPage, indexOfFirstRecord, indexOfLastRecord, listUserInfo, recordsPerPage])

  //Handle form
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IFormInput>(formOptions);
  const onSubmit: SubmitHandler<IFormInput> = (data: any) => {
    if (data) {
      if (modeEdit && data.id) {
        const newUpdate = listUserInfo.map((item) => {
          if (item.id === data.id) {
            return { ...data }
          }
          return item;
        })
        setListUserInfo(newUpdate);
        setModeEdit(false)
        reset()
      } else {
        const newId = listUserInfo.reduce((maxId, item) => Math.max(item.id, maxId), 0) + 1;
        setListUserInfo([...listUserInfo, { id: newId, ...data }])
        reset()
      }
    }
  }

  const deleteItem = (id: number) => {
    const newList = listUserInfo.filter((item) => item.id !== id);
    setListUserInfo(newList)
  }

  const showItemUpdate = (id: number) => {
    const itemUpdate: IFormInput = listUserInfo.filter((item) => item.id === id)[0];
    if (itemUpdate) {
      setModeEdit(true);
      setValue("id", itemUpdate.id)
      setValue("fullName", itemUpdate.fullName);
      setValue("email", itemUpdate.email);
      setValue("address", itemUpdate.address);
      setValue("city", itemUpdate.city);
      setValue("country", itemUpdate.country);
    }
  }


  return (
    <div className='bg-[#f3f4f6] h-screen'>
      <div className="flex flex-col p-10 gap-5">
        {/* Header screen */}
        <HeaderSection />
        {/* Main form */}
        <FormSection
          register={register}
          errors={errors}
          modeEdit={modeEdit}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
        {/* Display data */}
        <TableSection
          headers={headers}
          currentRecords={currentRecords}
          deleteItem={deleteItem}
          showItemUpdate={showItemUpdate}
        />
        {/*Paging*/}
        <PaginationSection
          goToPrevPage={goToPrevPage}
          goToNextPage={goToNextPage}
          currentPage={currentPage}
          recordsPerPage={recordsPerPage}
          listUserInfo={listUserInfo}
          currentRecords={currentRecords}
        />
      </div>
    </div>
  )
}

const HeaderSection = () => {
  return (
    <section className="">
      <h2 className='font-semibold text-xl text-[#6b7280]'>Responsive Form</h2>
      <h4 className="text-[#6b7280]">Form is mobile responsive. Give it a try.</h4>
    </section>
  )
};

const FormSection = ({ register, errors, modeEdit, handleSubmit, onSubmit }: any) => {
  return (

    <section className="bg-white px-10 py-5 flex md:flex-row flex-col gap-[10%] shadow-lg">
      <div className="">
        <h3 className='font-medium text-lg'>Personal Details</h3>
        <h6 className="'text-black font-normal">Please fill out all the fields.</h6>
      </div>
      <div className="flex-1">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label htmlFor="fullName">Full Name</label>
            <input {...register("fullName", { required: true, maxLength: 30 })} type="text" id="fullName"
              className="bg-[#f9fafb] pl-4 py-2 rounded-md border-[1px] border-gray-300 border-solid" />
            {errors?.fullName?.type === "required" && <p className='mt-1 text-red-400'>* This field is required</p>}
            {errors?.fullName?.type === "maxLength" && (
              <p className='mt-1 text-red-500'>Full name cannot exceed 30 characters</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email Address</label>
            <input {...register("email", { required: true, maxLength: 30 })} type="email"
              className="bg-[#f9fafb] pl-4 py-2 rounded-md border-[1px] border-gray-300 border-solid" />
            {errors?.email?.type === "required" && <p className='mt-1 text-red-400'>* This field is required</p>}
            {errors?.email?.type === "maxLength" && (
              <p className='mt-1 text-red-500'>Email cannot exceed 30 characters</p>
            )}
          </div>
          <div className="flex sm:flex-row flex-col gap-4">
            <div className="flex flex-col flex-[2]">
              <label htmlFor="address">Address / Street</label>
              <input {...register("address", { required: true })} type="text"
                className="bg-[#f9fafb] pl-4 py-2 rounded-md border-[1px] border-gray-300 border-solid" />
              {errors?.address?.type === "required" && <p className='mt-1 text-red-400'>* This field is required</p>}
            </div>
            <div className="flex flex-col flex-[1]">
              <label htmlFor="city">City</label>
              <input {...register("city", { required: true })} type="text"
                className="bg-[#f9fafb] pl-4 py-2 rounded-md border-[1px] border-gray-300 border-solid" />
              {errors?.city?.type === "required" && <p className='mt-1 text-red-400'>* This field is required</p>}

            </div>
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="country">Country / region</label>
            <select
              {...register("country", { required: "* Select one option" })}
              className="bg-[#f9fafb] pl-4 py-2 rounded-md border-[1px] border-gray-300 border-solid"
            >
              <option value="" >Select</option>
              <option value="Canada">Canada</option>
              <option value="America">America</option>
            </select>
            {errors.country && <p className="mt-1 text-red-500">{errors.country.message}</p>}
          </div>
          <div className="text-right">
            <button className="inline-block font-bold text-white bg-[#3b82f6] py-2 px-4 rounded-lg">{modeEdit ? 'Edit' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </section>
  );
};

const TableSection = ({ headers, currentRecords, deleteItem, showItemUpdate }: any) => {
  return (
    <section className="bg-[#f9fafb] shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed min-w-max">
          <thead>
            <tr>
              {headers.map((header: any, index: number) => (
                <th key={index} className="text-left px-8 mx-8 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? currentRecords.map((item: any) => (
              <tr key={item.id} className={`${item.id % 2 !== 0 ? "bg-white" : "bg-[#f9fafb]"}`}>
                <td className="px-8 py-2 break-words">{item.fullName}</td>
                <td className="px-8 py-2 break-words">{item.email}</td>
                <td className="px-8 py-2 break-words">{item.address}, {item.city}</td>
                <td className="px-8 py-2 break-words">{item.country}</td>
                <td className="px-8 py-2 break-words ">
                  <button className="text-blue-600 pr-2" onClick={() => showItemUpdate(item.id)}>Edit</button>
                  <button className="text-red-600" onClick={() => deleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            )) : <tr><td colSpan={5} className="px-8 py-2 text-center">No Data</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const PaginationSection = ({ goToPrevPage, goToNextPage, currentRecords }: any) => {
  return (
    <section className="flex gap-3 items-center justify-end">
      <div>
        <p>Showing <strong>{currentRecords.length}</strong> Entries</p>
      </div>
      <div className="flex">
        <button className="flex gap-1 items-center bg-[#1f40af] text-white px-2 rounded-l-lg" onClick={goToPrevPage}>
          <img src={arrowLeft} alt="" className="w-8 text-white" />
          <p>Prev</p>
        </button>
        <div className="w-[1px] bg-black" />
        <button className="flex gap-1 items-center bg-[#1f40af] text-white px-2 rounded-r-lg" onClick={goToNextPage}>
          <p>Next</p>
          <img src={arrowRight} alt="" className="w-8" />
        </button>
      </div>
    </section>
  );
  // JSX for pagination section
};

export default App
