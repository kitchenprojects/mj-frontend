import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { FiDownload, FiRefreshCw, FiCalendar, FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { showSuccess, showError } from '../../utils/swal';
import * as XLSX from 'xlsx';

export default function AdminReportPage() {
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Set default dates (this month)
    useEffect(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setStartDate(format(firstDay, 'yyyy-MM-dd'));
        setEndDate(format(lastDay, 'yyyy-MM-dd'));
    }, []);

    const loadReport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const { data } = await api.get(`/orders/admin/sales-report?${params.toString()}`);
            setReport(data);
        } catch (error) {
            console.error('Failed to load report:', error);
            showError('Gagal memuat laporan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            loadReport();
        }
    }, [startDate, endDate]);

    // Export to Excel - Comprehensive Accounting Report
    const exportToExcel = () => {
        if (!report || report.orders.length === 0) {
            showError('Tidak ada data untuk diekspor');
            return;
        }

        const wb = XLSX.utils.book_new();
        const reportDate = format(new Date(), 'dd MMMM yyyy HH:mm');
        const periodStart = format(new Date(startDate), 'dd MMMM yyyy');
        const periodEnd = format(new Date(endDate), 'dd MMMM yyyy');

        // ========== SHEET 1: COVER & EXECUTIVE SUMMARY ==========
        const coverData = [
            [''],
            ['DAPUR NEKTI'],
            ['LAPORAN PENJUALAN'],
            [''],
            ['Periode Laporan:', `${periodStart} - ${periodEnd}`],
            ['Tanggal Cetak:', reportDate],
            [''],
            ['═══════════════════════════════════════════════════════════════'],
            [''],
            ['RINGKASAN EKSEKUTIF'],
            [''],
            ['Indikator', 'Nilai', 'Keterangan'],
            ['Total Pendapatan', `Rp ${report.summary.totalRevenue.toLocaleString()}`, 'Pendapatan kotor dari seluruh transaksi'],
            ['Total Transaksi', report.summary.totalOrders, 'Jumlah order yang masuk'],
            ['Order Selesai', report.summary.completedOrders, 'Order dengan status Delivered'],
            ['Order Pending', report.summary.pendingOrders, 'Order yang masih diproses'],
            ['Jumlah Pelanggan', report.summary.uniqueCustomers, 'Pelanggan unik yang bertransaksi'],
            [''],
            ['ANALISIS PERFORMA'],
            [''],
            ['Rata-rata Nilai Order', report.summary.totalOrders > 0 ? `Rp ${Math.round(report.summary.totalRevenue / report.summary.totalOrders).toLocaleString()}` : 'Rp 0', 'Total Revenue / Total Order'],
            ['Tingkat Completion', report.summary.totalOrders > 0 ? `${Math.round((report.summary.completedOrders / report.summary.totalOrders) * 100)}%` : '0%', 'Order Selesai / Total Order'],
            [''],
        ];
        const coverWs = XLSX.utils.aoa_to_sheet(coverData);
        coverWs['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 40 }];
        XLSX.utils.book_append_sheet(wb, coverWs, 'Ringkasan Eksekutif');

        // ========== SHEET 2: DETAILED ORDERS ==========
        const ordersHeader = [
            ['DAFTAR TRANSAKSI DETAIL'],
            [`Periode: ${periodStart} - ${periodEnd}`],
            [''],
            ['No', 'Order ID', 'Tanggal Order', 'Waktu', 'Nama Pelanggan', 'No. Telepon', 'Status Order', 'Status Bayar', 'Tanggal Bayar', 'Total (Rp)']
        ];
        const ordersRows = report.orders.map((o, idx) => [
            idx + 1,
            o.order_id,
            format(new Date(o.order_date), 'dd/MM/yyyy'),
            format(new Date(o.order_date), 'HH:mm'),
            o.customer_name || '-',
            o.customer_phone || '-',
            o.status,
            o.payment_status || 'Unpaid',
            o.payment_date ? format(new Date(o.payment_date), 'dd/MM/yyyy HH:mm') : '-',
            Number(o.total_amount)
        ]);

        // Add summary row
        const totalRevenue = report.orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const ordersSummary = [
            [''],
            ['', '', '', '', '', '', '', '', 'TOTAL:', totalRevenue]
        ];

        const ordersWs = XLSX.utils.aoa_to_sheet([...ordersHeader, ...ordersRows, ...ordersSummary]);
        ordersWs['!cols'] = [
            { wch: 5 }, { wch: 38 }, { wch: 12 }, { wch: 8 }, { wch: 20 }, { wch: 15 },
            { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(wb, ordersWs, 'Detail Transaksi');

        // ========== SHEET 3: DAILY SALES BREAKDOWN ==========
        const dailyHeader = [
            ['REKAPITULASI PENJUALAN HARIAN'],
            [`Periode: ${periodStart} - ${periodEnd}`],
            [''],
            ['No', 'Tanggal', 'Jumlah Order', 'Total Pendapatan (Rp)', 'Rata-rata per Order (Rp)']
        ];
        const dailyRows = report.dailySales.map((d, idx) => [
            idx + 1,
            format(new Date(d.date), 'dd/MM/yyyy (EEEE)'),
            Number(d.orders),
            Number(d.revenue),
            d.orders > 0 ? Math.round(Number(d.revenue) / Number(d.orders)) : 0
        ]);

        // Daily totals
        const totalDailyOrders = report.dailySales.reduce((sum, d) => sum + Number(d.orders), 0);
        const totalDailyRevenue = report.dailySales.reduce((sum, d) => sum + Number(d.revenue), 0);
        const dailySummary = [
            [''],
            ['', 'TOTAL', totalDailyOrders, totalDailyRevenue, totalDailyOrders > 0 ? Math.round(totalDailyRevenue / totalDailyOrders) : 0]
        ];

        const dailyWs = XLSX.utils.aoa_to_sheet([...dailyHeader, ...dailyRows, ...dailySummary]);
        dailyWs['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 22 }, { wch: 22 }];
        XLSX.utils.book_append_sheet(wb, dailyWs, 'Penjualan Harian');

        // ========== SHEET 4: MENU PERFORMANCE ==========
        const menuHeader = [
            ['ANALISIS PERFORMA MENU'],
            [`Periode: ${periodStart} - ${periodEnd}`],
            [''],
            ['Rank', 'Nama Menu', 'Qty Terjual', 'Total Revenue (Rp)', 'Kontribusi Revenue (%)']
        ];
        const totalMenuRevenue = report.topItems.reduce((sum, item) => sum + Number(item.total_revenue), 0);
        const menuRows = report.topItems.map((item, idx) => [
            idx + 1,
            item.menu_name,
            Number(item.total_sold),
            Number(item.total_revenue),
            totalMenuRevenue > 0 ? `${((Number(item.total_revenue) / totalMenuRevenue) * 100).toFixed(1)}%` : '0%'
        ]);

        const totalMenuQty = report.topItems.reduce((sum, item) => sum + Number(item.total_sold), 0);
        const menuSummary = [
            [''],
            ['', 'TOTAL', totalMenuQty, totalMenuRevenue, '100%']
        ];

        const menuWs = XLSX.utils.aoa_to_sheet([...menuHeader, ...menuRows, ...menuSummary]);
        menuWs['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 12 }, { wch: 20 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, menuWs, 'Performa Menu');

        // ========== SHEET 5: STATUS BREAKDOWN ==========
        const statusCounts = {};
        const paymentCounts = {};
        report.orders.forEach(o => {
            statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
            const payStatus = o.payment_status || 'Unpaid';
            paymentCounts[payStatus] = (paymentCounts[payStatus] || 0) + 1;
        });

        const statusData = [
            ['BREAKDOWN STATUS ORDER & PEMBAYARAN'],
            [`Periode: ${periodStart} - ${periodEnd}`],
            [''],
            ['STATUS ORDER'],
            ['Status', 'Jumlah', 'Persentase'],
            ...Object.entries(statusCounts).map(([status, count]) => [
                status,
                count,
                `${((count / report.orders.length) * 100).toFixed(1)}%`
            ]),
            [''],
            ['STATUS PEMBAYARAN'],
            ['Status', 'Jumlah', 'Persentase'],
            ...Object.entries(paymentCounts).map(([status, count]) => [
                status,
                count,
                `${((count / report.orders.length) * 100).toFixed(1)}%`
            ]),
        ];
        const statusWs = XLSX.utils.aoa_to_sheet(statusData);
        statusWs['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }];
        XLSX.utils.book_append_sheet(wb, statusWs, 'Breakdown Status');

        // Generate filename
        const fileName = `Laporan_Penjualan_MJKitchen_${startDate}_to_${endDate}.xlsx`;

        // Download
        XLSX.writeFile(wb, fileName);
        showSuccess('Laporan komprehensif berhasil diexport!');
    };

    // Quick date presets
    const setPreset = (preset) => {
        const now = new Date();
        let start, end;

        switch (preset) {
            case 'today':
                start = end = now;
                break;
            case 'week':
                start = new Date(now.setDate(now.getDate() - 7));
                end = new Date();
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'year':
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                return;
        }

        setStartDate(format(start, 'yyyy-MM-dd'));
        setEndDate(format(end, 'yyyy-MM-dd'));
    };

    const getPaymentColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'out for delivery': return 'bg-purple-100 text-purple-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Laporan Penjualan</h1>
                    <p className="text-gray-500 text-sm">Export laporan ke Excel untuk analisis lebih lanjut</p>
                </div>
                <button
                    onClick={exportToExcel}
                    disabled={loading || !report?.orders?.length}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiDownload size={16} /> Export Excel
                </button>
            </div>

            {/* Date Filters */}
            <div className="bg-white border rounded-xl p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    {/* Quick Presets */}
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => setPreset('today')} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Hari Ini</button>
                        <button onClick={() => setPreset('week')} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">7 Hari</button>
                        <button onClick={() => setPreset('month')} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Bulan Ini</button>
                        <button onClick={() => setPreset('year')} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Tahun Ini</button>
                    </div>

                    <div className="h-6 w-px bg-gray-300 hidden lg:block"></div>

                    {/* Date Inputs */}
                    <div className="flex gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="text-gray-400" size={16} />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                        <span className="text-gray-400">sampai</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <button
                        onClick={loadReport}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12 text-gray-500">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    Loading laporan...
                </div>
            )}

            {!loading && report && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white border rounded-xl p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <FiDollarSign size={18} />
                                <span className="text-sm">Total Revenue</span>
                            </div>
                            <p className="text-xl font-bold text-emerald-600">
                                Rp {report.summary.totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white border rounded-xl p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <FiShoppingBag size={18} />
                                <span className="text-sm">Total Orders</span>
                            </div>
                            <p className="text-xl font-bold text-gray-800">{report.summary.totalOrders}</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <FiCheckCircle size={18} />
                                <span className="text-sm">Completed</span>
                            </div>
                            <p className="text-xl font-bold text-green-600">{report.summary.completedOrders}</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <FiTrendingUp size={18} />
                                <span className="text-sm">Pending</span>
                            </div>
                            <p className="text-xl font-bold text-yellow-600">{report.summary.pendingOrders}</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <FiUsers size={18} />
                                <span className="text-sm">Customers</span>
                            </div>
                            <p className="text-xl font-bold text-blue-600">{report.summary.uniqueCustomers}</p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Top Selling Items */}
                        <div className="bg-white border rounded-xl overflow-hidden">
                            <div className="p-4 border-b bg-gray-50">
                                <h3 className="font-semibold text-gray-800">Menu Terlaris</h3>
                            </div>
                            <div className="divide-y max-h-80 overflow-y-auto">
                                {report.topItems.length > 0 ? (
                                    report.topItems.map((item, idx) => (
                                        <div key={idx} className="p-3 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 truncate">{item.menu_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {Number(item.total_sold)} terjual
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium text-emerald-600">
                                                Rp {Number(item.total_revenue).toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">Belum ada data</div>
                                )}
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="lg:col-span-2 bg-white border rounded-xl overflow-hidden">
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Daftar Order</h3>
                                <span className="text-sm text-gray-500">{report.orders.length} orders</span>
                            </div>
                            <div className="overflow-x-auto max-h-80 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="text-left px-4 py-2 font-medium text-gray-600">Order ID</th>
                                            <th className="text-left px-4 py-2 font-medium text-gray-600">Pelanggan</th>
                                            <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                                            <th className="text-left px-4 py-2 font-medium text-gray-600">Bayar</th>
                                            <th className="text-right px-4 py-2 font-medium text-gray-600">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {report.orders.length > 0 ? (
                                            report.orders.map((o) => (
                                                <tr key={o.order_id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-mono text-xs">#{o.order_id.substring(0, 8)}</td>
                                                    <td className="px-4 py-2">{o.customer_name || '-'}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(o.status)}`}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentColor(o.payment_status)}`}>
                                                            {o.payment_status || 'Unpaid'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right font-medium text-emerald-600">
                                                        Rp {Number(o.total_amount).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                                    Tidak ada order dalam rentang tanggal ini
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
