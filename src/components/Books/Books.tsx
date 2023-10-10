import API from "../../services";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import "./Books.css";

const Books: React.FC<any> = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed
  const [data, setData] = useState([]);
  // State for sorting
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  // State for search
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // State for edit modal
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [addBook, setAddBook] = useState(false);
  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    try {
      const response: any = await API.get(
        "books",
        // {
        //   sortDirection: "DESC",
        //   totalPages: 26,
        //   pageSize: 25,
        //   currentPage: 1,
        //   totalElements: 649,
        // },
        {}
      );

      setData(response?.data?.data);
    } catch (err) {}
  };

  // Handle sorting
  const handleSort = (key: any) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Filter and sort data
  const filteredAndSortedData = data
    ?.filter((item: any) =>
      item?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Paginated data
  const paginatedData = filteredAndSortedData?.slice(startIndex, endIndex);

  const handleEdit = (record: any) => {
    console.log("record", record);
    setSelectedRecord(record);
    setIsEditing(true);
  };

  const editBook = async (values: any) => {
    try {
      const response: any = await API.put(
        "books/" + `${values?.id}`,
        values,
        {}
      );
      if (response?.status === 200) {
        getBooks();
      }
    } catch (err) {}
  };

  const addBookFunc = async (values: any) => {
    try {
      const response: any = await API.post("books", values, {});
      if (response?.status === 200) {
        getBooks();
      }
    } catch (err) {}
  };

  // Formik form for editing
  const formik = useFormik({
    initialValues: {
      author: selectedRecord?.author,
      country: selectedRecord?.country,
      language: selectedRecord?.language,
      link: selectedRecord?.link,
      pages: selectedRecord?.pages,
      title: selectedRecord?.title,
      year: selectedRecord?.year,
      id: selectedRecord?.id,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // Handle form submission here
      console.log("Edited Data:", values.id);
      // Close the edit modal
      editBook(values);
      setIsEditing(false);
    },
  });

  const formik1 = useFormik({
    initialValues: {
      author: "",
      country: "",
      language: "",
      link: "",
      pages: "",
      title: "",
      year: "",
      id: "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      // Handle form submission here
      console.log("Edited Data:", values.id);
      // Close the edit modal
      addBookFunc(values);
      setAddBook(false);
    },
  });

  // Render the component
  return (
    <div className="books-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {" "}
        <h1>Books</h1>
        <button
          className="submit-button"
          onClick={() => {
            setAddBook(true);
          }}
        >
          Add Book
        </button>
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("title")}>
              Title
              {sortBy === "title" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th>Author</th>
            <th>Country</th>
            <th>Language</th>
            <th>Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((item: any) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.country}</td>
              <td>{item.language}</td>
              <td>{item.year}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">Edit Book</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    {...formik.getFieldProps("title")}
                    // value={selectedRecord?.title || ""}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    {...formik.getFieldProps("author")}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    {...formik.getFieldProps("country")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <input
                    type="text"
                    id="language"
                    {...formik.getFieldProps("language")}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <input
                    type="text"
                    id="year"
                    {...formik.getFieldProps("year")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pages">Pages</label>
                  <input
                    type="text"
                    id="pages"
                    {...formik.getFieldProps("pages")}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="link">Link</label>
                  <input
                    type="text"
                    id="link"
                    {...formik.getFieldProps("link")}
                  />
                </div>
              </div>

              <div className="form-row buttons-row">
                <button type="submit" className="submit-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addBook && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">Edit Book</h2>
            <form onSubmit={formik1.handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    {...formik1.getFieldProps("title")}
                    // value={selectedRecord?.title || ""}
                    onChange={formik1.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    {...formik1.getFieldProps("author")}
                    onChange={formik1.handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    {...formik1.getFieldProps("country")}
                    onChange={formik1.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <input
                    type="text"
                    id="language"
                    {...formik1.getFieldProps("language")}
                    onChange={formik1.handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <input
                    type="text"
                    id="year"
                    {...formik1.getFieldProps("year")}
                    onChange={formik1.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pages">Pages</label>
                  <input
                    type="text"
                    id="pages"
                    {...formik1.getFieldProps("pages")}
                    onChange={formik1.handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="link">Link</label>
                  <input
                    type="text"
                    id="link"
                    onChange={formik1.handleChange}
                  />
                </div>
              </div>

              <div className="form-row buttons-row">
                <button type="submit" className="submit-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setAddBook(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
