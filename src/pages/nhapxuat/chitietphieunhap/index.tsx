// import type { ActionType } from "@ant-design/pro-components";
// import type { ViTriLapDatItemType } from "#src/api/danhmuc/vitri/types.js";
// import type { LoaiThietBiItemType } from "#src/api/danhmuc/loaithietbi/types.js";
// import type { DonViTinhItemType } from "#src/api/danhmuc/donvitinh/types.js";
// import { fetchDeleteMultiplePhieuNhapItems, fetchPhieuNhapList, type PhieuNhapItemType } from "#src/api/nhapxuat/phieunhap/index";
// import type { ChiTietPhieuNhapItemType } from "#src/api/nhapxuat/chitietphieunhap/index.js";
// import { message } from "antd";
// import { useEffect, useRef, useState } from "react";
// import { fetchLoaiThietBiList } from "#src/api/danhmuc/loaithietbi/index.js";
// import { fetchViTriLapDatList } from "#src/api/danhmuc/vitri/index.js";
// import { fetchDonViTinhList } from "#src/api/danhmuc/donvitinh/index.js";
// import {
//    fetchAddChiTietPhieuNhapItem,
//    fetchChiTietPhieuNhapById,
//    fetchDeleteChiTietPhieuNhapItem,
//    fetchDeleteMultipleChiTietPhieuNhapItems,
//    fetchUpdateChiTietPhieuNhapItem,
//    fetchChiTietPhieuNhapList
// } from "#src/api/nhapxuat/chitietphieunhap/index.js";
// import { BasicContent } from "#src/components/basic-content";

// import ChiTietPhieuNhapModal from "./components/ChiTietPhieuNhapModal";
// import ChiTietPhieuNhapTable from "./components/ChiTietPhieuNhapTable";
// import ChiTietPhieuNhapToolBar from "./components/ChiTietPhieuNhapToolBar";

// function ChiTietPhieuNhapPage() {
//     const actionRef = useRef<ActionType>(null);
//     const [openModal, setOpenModal] = useState(false);
//     const [editingRecord, setEditingRecord] = useState<ChiTietPhieuNhapItemType | null>(
//         null,
//     );
//     const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
//     const [tableData, setTableData] = useState<ChiTietPhieuNhapItemType[]>([]);
//     const [loaiThietBiList, setLoaiThietBiList] = useState<LoaiThietBiItemType[]>([]);
//     const [viTriLapDatList, setViTriLapDatList] = useState<ViTriLapDatItemType[]>([]);
//     const [phieuNhapList, setPhieuNhapList] = useState<PhieuNhapItemType[]>([]);
// const [donViTinhList, setDonViTinhList] = useState<DonViTinhItemType[]>([]);
//     // Fetch danh sách đơn vị khi component được mount
//     useEffect(() => {
//         const fetchLoaiThietBi = async () => {
//             try {
//                 const result = await fetchLoaiThietBiList();
//                 setLoaiThietBiList(result);
//             }
//             catch (error) {
//                 message.error(`Lỗi khi tải danh sách đơn vị: ${error}`);
//             }
//         };

//         const fetchDonViTinh = async () => {
//             try {
//                 const result = await fetchDonViTinhList();
//                 setDonViTinhList(result);
//             }
//             catch (error) {
//                 message.error(`Lỗi khi tải danh sách đơn vị tính: ${error}`);
//             }
//         };

//         const fetchPhieuNhap = async () => {
//             try {
//                 const result = await fetchPhieuNhapList();
//                 setPhieuNhapList(result);
//                 setTableData(result);
//             }
//             catch (error) {
//                 message.error(`Lỗi khi tải danh sách phiếu nhập: ${error}`);
//             }
//         };

//         const fetchViTriLapDat = async () => {
//             try {
//                 const result = await fetchViTriLapDatList();
//                 setViTriLapDatList(result);
//             }
//             catch (error) {
//                 message.error(`Lỗi khi tải danh sách vị trí lắp đặt: ${error}`);
//             }
//         };

//         fetchLoaiThietBi();
//         fetchViTriLapDat();
//         fetchPhieuNhap();
//         fetchDonViTinh();
//     }, []);

//     const handleSubmit = async (values: any) => {

//         try {
//             if (editingRecord) {
//                 await fetchUpdateChiTietPhieuNhapItem(editingRecord.id, values);
//                 message.success("Cập nhật thành công");
//             }
//             else {
//                 await fetchAddChiTietPhieuNhapItem(values);
//                 message.success("Thêm thành công");
//             }

//             setOpenModal(false);
//             setEditingRecord(null);
//             actionRef.current?.reload();
//             return true;
//         }
//         catch (error) {
//             message.error(`Có lỗi xảy ra: ${error}`);
//             return false;
//         }
//     };

//     const handleDelete = async (id: number) => {
//         try {
//             await fetchDeleteChiTietPhieuNhapItem(id);
//             message.success("Xóa thành công");
//             actionRef.current?.reload();
//         }
//         catch (error) {
//             message.error(`Xóa thất bại ${error}`);
//         }
//     };

//     const handleDeleteMany = async () => {
//         try {
//             await fetchDeleteMultiplePhieuNhapItems(selectedRowKeys as number[]);
//             message.success("Xóa nhiều thành công");
//             setSelectedRowKeys([]);
//             actionRef.current?.reload();
//         }
//         catch (error) {
//             message.error(`Xóa thất bại ${error}`);
//         }
//     };

//     return (
//         <>
//             <BasicContent>
//                 <ChiTietPhieuNhapTable
//                     actionRef={actionRef}
//                     dataSource={tableData}
//                     loading={false}
//                     loaiThietBiList={loaiThietBiList}
//                     viTriLapDatList={viTriLapDatList}
//                     request={async (params: any) => {
//                         try {
//                             const result = await fetchChiTietPhieuNhapList();
//                             setTableData(result);
//                             // Filter dữ liệu dựa trên tham số tìm kiếm
//                             let filtered = result;

//                             if (params.phieu_nhap_id) {
//                                 filtered = filtered.filter(
//                                     item => Number(item.phieu_nhap_id) === Number(params.phieu_nhap_id),

//                                 );
//                             }

//                         }
//                         catch (error) {
//                             console.error("Error fetching data:", error);
//                             return {
//                                 data: [],
//                                 success: false,
//                                 total: 0,
//                             };
//                         }
//                     }}
//                     onEdit={(record) => {
//                         setEditingRecord(record);
//                         setOpenModal(true);
//                     }}
//                     onDelete={handleDelete}
//                     rowSelection={{
//                         selectedRowKeys,
//                         onChange: (keys: React.Key[]) => {
//                             setSelectedRowKeys(keys);
//                         },
//                     }}
//                     toolbar={(
//                         <ChiTietPhieuNhapToolBar
//                             selectedRowKeys={selectedRowKeys}
//                             onAdd={() => {
//                                 setEditingRecord(null);
//                                 setOpenModal(true);
//                             }}
//                             onDeleteMany={handleDeleteMany}
//                             data={filteredData}
//                         />
//                     )}
//                 />

//                 <ChiTietPhieuNhapModal
//                     open={openModal}
//                     onOpenChange={setOpenModal}
//                     onSubmit={handleSubmit}
//                     initialValues={editingRecord}
//                     donViTinhList={donViTinhList}
//                     viTriLapDatList={viTriLapDatList}
//                     loaiThietBiList={loaiThietBiList}
//                     phieuNhapList={phieuNhapList}
//                 />
//             </BasicContent>
//         </>
//     );
// }

// export default ChiTietPhieuNhapPage;
