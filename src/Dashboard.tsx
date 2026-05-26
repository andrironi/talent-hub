/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { 
  Briefcase, 
  Settings, 
  MessageSquare, 
  Bookmark, 
  MapPin, 
  Calendar, 
  FileText,
  FilePlus,
  LayoutDashboard,
  Search,
  Bell,
  MoreVertical,
  ExternalLink,
  Plus,
  Rocket,
  Building2,
  Phone,
  Mail,
  User,
  Globe,
  Check,
  Send,
  Trash2,
  Menu,
  X,
  Sparkles,
  Award,
  Filter,
  Users,
  AlertCircle,
  Eye,
  LogOut,
  ChevronRight,
  TrendingUp,
  Heart,
  Undo,
  PanelLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { toast } from 'sonner';
import { useReactToPrint } from 'react-to-print';

// Custom interface for Candidate
interface Candidate {
  id: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
  skills: string[];
  location: string;
  bio: string;
  salary: string;
  experience: string;
}

interface Order {
  id: string;
  title: string;
  company: string;
  status: 'Aktif' | 'Selesai' | 'Butuh Tindakan';
  createdAt: string;
  dept: string;
  salary: string;
  type: string;
  paymentStatus: 'Unpaid' | 'Paid';
}

export default function Dashboard() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const invoiceRef = useRef<HTMLDivElement>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true); // Default to true so it shows initially, but user can collapse it!

  // Job postings state
  const [jobs, setJobs] = useState([
    { id: '1', title: 'Staff Product Designer', dept: 'Design', applicants: 45, status: 'Active', code: 'PD', location: 'Jakarta / Remote', salary: 'Rp 25M - 35M', type: 'Full-time' },
    { id: '2', title: 'Fullstack Engineer', dept: 'Engineering', applicants: 22, status: 'Active', code: 'FE', location: 'Bandung / Hybrid', salary: 'Rp 18M - 26M', type: 'Full-time' },
    { id: '3', title: 'Design Systems Lead', dept: 'Design', applicants: 12, status: 'Reviewing', code: 'DS', location: 'Remote', salary: 'Rp 20M - 30M', type: 'Contract' },
    { id: '4', title: 'Product Manager', dept: 'Product', applicants: 63, status: 'Draft', code: 'PM', location: 'Jakarta', salary: 'Rp 22M - 32M', type: 'Full-time' },
  ]);

  // Recruitment Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('talentHubOrders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((o: any) => ({
          ...o,
          paymentStatus: o.paymentStatus || 'Unpaid'
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'ORD-001', title: 'Senior Fullstack Developer', company: 'Acme Corp', status: 'Aktif', createdAt: '2026-05-25', dept: 'Engineering', salary: 'Rp 22M - 28M', type: 'Full-time', paymentStatus: 'Paid' },
      { id: 'ORD-002', title: 'Lead UI/UX Designer', company: 'Acme Corp', status: 'Butuh Tindakan', createdAt: '2026-05-24', dept: 'Design', salary: 'Rp 18M - 24M', type: 'Full-time', paymentStatus: 'Unpaid' },
      { id: 'ORD-003', title: 'DevOps & CI/CD Specialist', company: 'Acme Corp', status: 'Selesai', createdAt: '2026-05-22', dept: 'Engineering', salary: 'Rp 20M - 26M', type: 'Full-time', paymentStatus: 'Paid' },
      { id: 'ORD-004', title: 'Product Manager Digital', company: 'Acme Corp', status: 'Aktif', createdAt: '2026-05-20', dept: 'Product', salary: 'Rp 21M - 28M', type: 'Full-time', paymentStatus: 'Unpaid' },
      { id: 'ORD-005', title: 'Data Scientist Lead', company: 'Acme Corp', status: 'Selesai', createdAt: '2026-05-18', dept: 'Engineering', salary: 'Rp 25M - 35M', type: 'Full-time', paymentStatus: 'Paid' }
    ];
  });

  // Keep orders updated in localstorage
  useEffect(() => {
    localStorage.setItem('talentHubOrders', JSON.stringify(orders));
  }, [orders]);

  // Derived order counters
  const totalOrders = orders.length;
  const activeOrdersCount = orders.filter(o => o.status === 'Aktif').length;
  const completedOrdersCount = orders.filter(o => o.status === 'Selesai').length;
  const alertOrdersCount = orders.filter(o => o.status === 'Butuh Tindakan').length;

  // Recruiter profile settings state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState(user?.companyName || 'Acme Corp');
  const [location, setLocation] = useState(user?.location || 'Jakarta, Indonesia');
  const [phone, setPhone] = useState(user?.phone || '+62 812-3456-7890');
  const [bio, setBio] = useState(user?.bio || 'We design and craft beautiful digital experiences.');
  const [website, setWebsite] = useState(user?.website || 'https://acme.com');
  const [avatarSeed, setAvatarSeed] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  // Job creation modal/form toggle state
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Engineering');
  const [newJobLocation, setNewJobLocation] = useState('Remote');
  const [newJobSalary, setNewJobSalary] = useState('Rp 15M - 25M');
  const [newJobType, setNewJobType] = useState('Full-time');

  // Order creation modal/form state
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [newOrderTitle, setNewOrderTitle] = useState('');
  const [newOrderDept, setNewOrderDept] = useState('Engineering');
  const [newOrderSalary, setNewOrderSalary] = useState('Rp 15M - 25M');
  const [newOrderType, setNewOrderType] = useState('Full-time');
  const [newOrderStatus, setNewOrderStatus] = useState<'Aktif' | 'Selesai' | 'Butuh Tindakan'>('Aktif');

  // 3-Step Order Creation Page/Tab states
  const [orderStep, setOrderStep] = useState<number>(1);
  
  // Step 1: Detail Posisi
  const [orderPosTitle, setOrderPosTitle] = useState('');
  const [orderPosHeadcount, setOrderPosHeadcount] = useState<number>(1);
  const [orderPosJobType, setOrderPosJobType] = useState<'Onsite' | 'Hybrid' | 'Remote'>('Onsite');
  const [orderPosLocation, setOrderPosLocation] = useState('Jakarta');
  const [orderPosDescription, setOrderPosDescription] = useState('');
  const [orderPosNotes, setOrderPosNotes] = useState('');
  const [orderPosDept, setOrderPosDept] = useState('Engineering');

  // Step 2: Kriteria Kandidat
  const [orderCritExp, setOrderCritExp] = useState('3-5 tahun');
  const [orderCritMinEdu, setOrderCritMinEdu] = useState('S1');
  const [orderCritMajor, setOrderCritMajor] = useState('Teknik Informatika');
  const [orderCritSkills, setOrderCritSkills] = useState('React, TypeScript, Node.js');
  const [orderCritSalaryBudget, setOrderCritSalaryBudget] = useState('Rp 15M - 25M');

  // Completed order for invoice step (Step 3)
  const [completedOrderForInvoice, setCompletedOrderForInvoice] = useState<Order | null>(null);

  const handleCreateOrderMultiStep = () => {
    if (!orderPosTitle.trim()) {
      toast.error('Nama posisi pekerjaan tidak boleh kosong!');
      return;
    }
    const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder: Order = {
      id: newId,
      title: orderPosTitle,
      company: companyName || 'Acme Corp',
      status: 'Aktif',
      createdAt: new Date().toISOString().split('T')[0],
      dept: orderPosDept,
      salary: orderCritSalaryBudget,
      type: orderPosJobType,
      paymentStatus: 'Unpaid' // Order secara default akan unpaid saat belum di bayarkan
    };
    
    // Persist into state & localStorage (acting as our database)
    setOrders([newOrder, ...orders]);
    
    // Set this order for step 3 display
    setCompletedOrderForInvoice(newOrder);
    
    // Move to step 3 (Invoice)
    setOrderStep(3);
    
    toast.success('Pemberitahuan: Order rekrutmen baru berhasil tersimpan ke database! Silakan selesaikan invoice pembayaran.');
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderTitle.trim()) {
      toast.error('Nama posisi order tidak boleh kosong!');
      return;
    }
    const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder: Order = {
      id: newId,
      title: newOrderTitle,
      company: companyName || 'Acme Corp',
      status: newOrderStatus,
      createdAt: new Date().toISOString().split('T')[0],
      dept: newOrderDept,
      salary: newOrderSalary,
      type: newOrderType,
      paymentStatus: 'Unpaid' // Order secara default akan unpaid saat belum di bayarkan
    };
    setOrders([newOrder, ...orders]);
    setIsCreatingOrder(false);
    setNewOrderTitle('');
    toast.success('Order rekrutmen baru berhasil dibuat! Status: Belum Dibayar (Unpaid).');
  };

  // Payment UI flow state
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'VA' | 'CC' | 'QRIS'>('VA');

  const handlePayOrder = (orderId: string) => {
    const target = orders.find(o => o.id === orderId);
    if (target) {
      setPayingOrder(target);
    }
  };

  const handleConfirmPayment = () => {
    if (!payingOrder) return;
    setIsProcessingPayment(true);
    // Simulasikan delay network payment gateway 1.5 detik
    setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.id === payingOrder.id) {
          return { ...o, paymentStatus: 'Paid' };
        }
        return o;
      }));
      setIsProcessingPayment(false);
      setPayingOrder(null);
      toast.success(`Pembayaran ORD-${payingOrder.id.replace('ORD-', '')} (${payingOrder.title}) berhasil dikonfirmasi!`);
    }, 1500);
  };

  const handlePrintInvoice = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: completedOrderForInvoice ? `Invoice-${completedOrderForInvoice.id}` : 'Invoice',
  });

  // Discover candidate pool
  const initialTalentPool: Candidate[] = [
    { id: 't1', name: 'Budi Santoso', role: 'Fullstack Engineer', rating: 4.9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'], location: 'Jakarta, ID', bio: 'Senior developer specializing in scalable web systems and elegant architectures.', salary: 'Rp 18M - 24M', experience: '5 years' },
    { id: 't2', name: 'Siti Aminah', role: 'UI/UX Designer', rating: 4.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', skills: ['Figma', 'UI Design', 'Design Systems', 'User Research'], location: 'Yogyakarta, ID', bio: 'Passionate about crafting pixel-perfect interfaces that delight users.', salary: 'Rp 12M - 16M', experience: '3 years' },
    { id: 't3', name: 'Michael Chen', role: 'DevOps Engineer', rating: 4.7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', skills: ['Docker', 'AWS', 'CI/CD', 'Kubernetes'], location: 'Remote', bio: 'Automating deployment loops. Focus on cloud security, scaling, and zero-downtime workflows.', salary: 'Rp 22M - 30M', experience: '6 years' },
    { id: 't4', name: 'Adit Pratama', role: 'Product Manager', rating: 4.6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adit', skills: ['Product Strategy', 'Agile', 'Scrum', 'Data Analytics'], location: 'Bandung, ID', bio: 'Bridging technical talent and business goals to deliver high-impact products.', salary: 'Rp 20M - 26M', experience: '4 years' },
    { id: 't5', name: 'Rian Wijaya', role: 'Frontend Engineer', rating: 4.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rian', skills: ['React', 'Tailwind CSS', 'TypeScript', 'State Management'], location: 'Surabaya, ID', bio: 'Specialist in frontend interactivity, butter-smooth user flows, and mobile-responsive code.', salary: 'Rp 14M - 18M', experience: '3 years' }
  ];

  const [talentPool, setTalentPool] = useState<Candidate[]>(initialTalentPool);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterTag, setSelectedFilterTag] = useState<string | null>(null);

  // Shortlisted candidates state
  const [shortlisted, setShortlisted] = useState<Candidate[]>([
    { id: 's1', name: 'Dian Paramita', role: 'Staff Product Designer', rating: 4.9, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dian', skills: ['Figma', 'User Research', 'Design Systems'], location: 'Jakarta, ID', bio: 'Mendesain antarmuka berkelas dunia dengan riset mendalam.', salary: 'Rp 25M - 30M', experience: '4 years' },
    { id: 's2', name: 'Reza Rahadian', role: 'Product Manager', rating: 4.8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reza', skills: ['Product Strategy', 'Scrum', 'Agile'], location: 'Jakarta, ID', bio: 'Memimpin tim lintas disiplin untuk meluncurkan produk inovatif.', salary: 'Rp 22M - 28M', experience: '5 years' }
  ]);

  // Messages Thread State
  const [chatCandidates, setChatCandidates] = useState([
    { id: 'c1', name: 'Sarah Connor', role: 'Staff Product Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', unread: true, lastMsg: 'Selamat pagi, saya sangat tertarik dengan lowongan di Acme Corp.' },
    { id: 'c2', name: 'Alex Rivera', role: 'Fullstack Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', unread: false, lastMsg: 'Baik, berikut link portfolio Github dan CV terbaru saya.' },
    { id: 'c3', name: 'Evelyn Hwang', role: 'Design Systems Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn', unread: false, lastMsg: 'Apakah minggu ini ada waktu luang untuk interview teknis?' },
  ]);

  const [selectedChatCandidateId, setSelectedChatCandidateId] = useState<string>('c1');
  const [typedMessage, setTypedMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, { sender: 'recruiter' | 'candidate', text: string, time: string }[]>>({
    'c1': [
      { sender: 'candidate', text: 'Halo, selamat pagi Acme Corp! Saya tertarik dengan lowongan Staff Product Designer.', time: '09:12 AM' },
      { sender: 'recruiter', text: 'Selamat pagi Sarah! Terima kasih atas ketertarikan Anda. Bisakah Anda menceritakan pengalaman Anda memimpin tim design system?', time: '09:15 AM' },
      { sender: 'candidate', text: 'Saya memiliki pengalaman 4 tahun membangun dan mengelola design system berbasis Figma untuk skala enterprise.', time: '09:18 AM' }
    ],
    'c2': [
      { sender: 'candidate', text: 'Selamat sore! Berikut tautan GitHub saya untuk evaluasi teknis lowongan Fullstack Engineer.', time: '02:04 PM' },
      { sender: 'recruiter', text: 'Keren sekali Alex! Saya sudah meninjau repositori Anda. Kualitas kode Anda sangat rapi dan terdokumentasi baik.', time: '02:40 PM' },
      { sender: 'candidate', text: 'Baik, berikut link portfolio Github dan CV terbaru saya.', time: '02:45 PM' }
    ],
    'c3': [
      { sender: 'candidate', text: 'Halo, apakah interview teknis design system lead akan diadakan secara synchronous?', time: 'Yesterday' }
    ]
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Sarah Connor mengirim pesan baru', desc: 'Detail: "Saya memiliki pengalaman 4 tahun membangun..."', time: '5m jalu', unread: true, category: 'message' },
    { id: 'n2', title: 'Lamaran Baru Diterima', desc: 'Budi Santoso melamar sebagai Fullstack Engineer', time: '1h jalu', unread: true, category: 'application' },
    { id: 'n3', title: 'Verifikasi Profil Berhasil', desc: 'Profil perusahaan Acme Corp Anda kini telah terverifikasi secara resmi.', time: '1d jalu', unread: false, category: 'system' }
  ]);

  // Synchronize state with current user profile if it loads/changes
  useEffect(() => {
    if (user) {
      setName(prev => prev || user.name || '');
      setEmail(prev => prev || user.email || '');
      setCompanyName(prev => prev || user.companyName || 'Acme Corp');
      setLocation(prev => prev || user.location || 'Jakarta, Indonesia');
      setPhone(prev => prev || user.phone || '+62 812-3456-7890');
      setBio(prev => prev || user.bio || 'We design and craft beautiful digital experiences.');
      setWebsite(prev => prev || user.website || 'https://acme.com');
      setAvatarSeed(prev => prev || user.email || '');
    }
  }, [user]);

  // Early route protection return
  if (!user) {
    return <Navigate to="/?mode=login" />;
  }

  // Handler for adding a new job
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) {
      toast.error('Judul pekerjaan tidak boleh kosong!');
      return;
    }
    const newId = (jobs.length + 1).toString();
    const codes = ['JD', 'FE', 'BE', 'PM', 'DS', 'PD', 'DE', 'FS'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    
    const job = {
      id: newId,
      title: newJobTitle,
      dept: newJobDept,
      applicants: 0,
      status: 'Active',
      code: randomCode,
      location: newJobLocation,
      salary: newJobSalary,
      type: newJobType,
    };

    setJobs([job, ...jobs]);
    setIsCreatingJob(false);
    setNewJobTitle('');
    toast.success('Lowongan Kerja Berhasil Diposting!');

    // Dispatch a beautiful live notification for listing creation
    const newNotif = {
      id: 'n_' + Date.now(),
      title: 'Lowongan Baru Diterbitkan',
      desc: `${newJobTitle} baru saja dipublikasikan di Talent Search.`,
      time: 'Just now',
      unread: true,
      category: 'system'
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Handler for deleting a job listing
  const handleDeleteJob = (id: string, title: string) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success(`Lowongan ${title} berhasil ditutup.`);
  };

  // Toggle Shortlist Candidates
  const toggleShortlist = (candidate: Candidate) => {
    const exists = shortlisted.some(s => s.id === candidate.id || s.name === candidate.name);
    if (exists) {
      setShortlisted(shortlisted.filter(s => s.name !== candidate.name));
      toast.success(`${candidate.name} dihapus dari daftar shortlisted.`);
    } else {
      setShortlisted([...shortlisted, candidate]);
      toast.success(`${candidate.name} masuk daftar shortlisted!`);
    }
  };

  // Direct candidate mapping to Chat Messages
  const handleInitiateChat = (cand: { name: string, role: string, avatar: string }) => {
    // Check if candidate already has a chat
    const match = chatCandidates.find(c => c.name === cand.name);
    let cid = '';
    if (match) {
      cid = match.id;
    } else {
      cid = 'c_gen_' + Date.now();
      const newChatUser = {
        id: cid,
        name: cand.name,
        role: cand.role,
        avatar: cand.avatar,
        unread: false,
        lastMsg: 'Memulai percakapan dengan recruiter...'
      };
      setChatCandidates([newChatUser, ...chatCandidates]);
      setChatMessages(prev => ({
        ...prev,
        [cid]: [{ sender: 'candidate', text: `Halo! Saya ${cand.name}, terimakasih telah menghubungkan saya dengan posisi ${cand.role}.`, time: 'Just Now' }]
      }));
    }
    setSelectedChatCandidateId(cid);
    setActiveTab('Messages');
    setIsMobileSidebarOpen(false);
  };

  // Send Message logic
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const stream = chatMessages[selectedChatCandidateId] || [];
    const updatedStream = [
      ...stream,
      { sender: 'recruiter' as const, text: typedMessage, time: 'Just Now' }
    ];

    setChatMessages({
      ...chatMessages,
      [selectedChatCandidateId]: updatedStream
    });

    const activeCand = chatCandidates.find(c => c.id === selectedChatCandidateId);
    if (activeCand) {
      activeCand.lastMsg = typedMessage;
    }

    setTypedMessage('');
    toast.success('Pesan Terkirim');

    // Trigger candidate dynamic AI response simulation
    setTimeout(() => {
      const activeConvo = chatCandidates.find(c => c.id === selectedChatCandidateId);
      if (!activeConvo) return;

      const responses = [
        "Baik Pak/Bu, saya sangat mengapresiasi penawaran ini. Saya siap mengikuti interview minggu ini.",
        "Terima kasih atas tanggapannya! Saya akan segera merapikan file portofolio dan mengirimkannya.",
        "Sungguh kabar luar biasa! Kapan jadwal interview teknis tersebut bisa dijadwalkan?",
        "Siap, saya mengerti. Saya akan mempelajari deskripsi pekerjaan yang telah dikirimkan secara seksama."
      ];
      const randomMsg = responses[Math.floor(Math.random() * responses.length)];
      
      setChatMessages(prev => ({
        ...prev,
        [selectedChatCandidateId]: [
          ...(prev[selectedChatCandidateId] || []),
          { sender: 'candidate', text: randomMsg, time: 'Just Now' }
        ]
      }));

      activeConvo.lastMsg = randomMsg;
      activeConvo.unread = true;
      toast.success(`Jawaban masuk dari ${activeConvo.name}`);
    }, 1500);
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        name,
        email,
        companyName,
        location,
        phone,
        bio,
        website,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed || email}`
      });
      setIsSaving(false);
      toast.success('Profil recruiter berhasil diperbarui!');
    }, 850);
  };

  // Sign out direct handler
  const handleSignOutDirect = () => {
    logout();
    navigate('/');
    toast.info('Keluar dari sistem');
  };

  // Filter Search candidates pools
  const filteredCandidates = talentPool.filter(cand => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      cand.name.toLowerCase().includes(query) ||
      cand.role.toLowerCase().includes(query) ||
      cand.skills.some(sk => sk.toLowerCase().includes(query));
    
    if (selectedFilterTag) {
      return matchesSearch && cand.skills.includes(selectedFilterTag);
    }
    return matchesSearch;
  });

  const allSkillsTags = Array.from(new Set(initialTalentPool.flatMap(c => c.skills)));

  // Sidebar Items specification
  const sidebarItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Buat Order Baru', icon: FilePlus },
    { name: 'Active Jobs', icon: Briefcase, count: jobs.length },
    { name: 'Messages', icon: MessageSquare, count: chatCandidates.filter(c => c.unread).length || undefined },
    { name: 'Shortlisted Talents', icon: Bookmark, count: shortlisted.length },
    { name: 'Search Talents', icon: Search },
    { name: 'Notifications', icon: Bell, count: notifications.filter(n => n.unread).length || undefined },
    { name: 'Profile Settings', icon: Settings },
  ];

  const workspaceAnimate = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row relative">
      
      {/* MOBILE HEADER BANNER */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-zinc-200 z-30 px-6 py-4 sticky top-0 w-full shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileSidebarOpen(true)} 
            className="text-zinc-650 hover:bg-zinc-100 rounded-xl"
            id="mobile-sidebar-toggle"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Rocket className="text-white w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-zinc-950 text-base">TalentHub</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-[10px] font-bold py-0.5 px-2 bg-zinc-100/50 border-zinc-200 capitalize">
            {activeTab}
          </Badge>
          <Avatar className="w-8 h-8 rounded-full border-2 border-zinc-100 cursor-pointer" onClick={() => setActiveTab('Profile Settings')}>
            <AvatarImage src={user.avatar} referrerPolicy="no-referrer" />
            <AvatarFallback className="font-bold text-xs">U</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* MOBILE DRAWER (SHEET OVERLAY) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Nav Menu Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white border-r border-zinc-200 z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden"
            >
              <div className="space-y-6 flex-1 overflow-y-auto min-h-0 no-scrollbar pr-1">
                {/* Drawer Branding */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2 select-none">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                      <Rocket className="text-white w-4 h-4" />
                    </div>
                    <span className="font-black tracking-tight text-lg text-zinc-900">TalentHub</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)} className="rounded-xl h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Recruiter Badge Box */}
                <div className="p-4 bg-zinc-50 rounded-2xl flex items-center gap-3 border border-zinc-100">
                  <Avatar className="w-10 h-10 border border-zinc-200">
                    <AvatarImage src={user.avatar} referrerPolicy="no-referrer" />
                    <AvatarFallback className="font-bold text-xs">U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-zinc-950 truncate leading-none mb-1">{user.name}</h5>
                    <p className="text-[10px] text-zinc-400 font-semibold truncate uppercase tracking-widest">{user.companyName || 'Acme'}</p>
                  </div>
                </div>

                {/* Nav Links */}
                <div className="space-y-1">
                  {sidebarItems.map((item, idx) => {
                    const isActive = activeTab === item.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(item.name);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-zinc-900 text-white shadow-md' 
                            : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{item.name}</span>
                        </div>
                        {item.count && (
                          <Badge className={isActive ? 'bg-white text-zinc-950 font-black' : 'bg-zinc-150 text-zinc-700 border-none font-bold'}>
                            {item.count}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <Button 
                  onClick={handleSignOutDirect}
                  variant="ghost" 
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl justify-start text-xs font-bold gap-3 py-5"
                >
                  <LogOut className="w-4 h-4" /> Keluar Akun
                </Button>
                <div className="text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold">TalentHub Admin Portal © 2026</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 1. DESKTOP SLIM DARK ICON RAIL (AS SHOWN IN THE IMAGE) */}
      <aside className="hidden lg:flex flex-col w-20 bg-zinc-950 h-screen fixed left-0 top-0 z-30 justify-between items-center py-6 border-r border-zinc-900 select-none">
        <div className="flex flex-col items-center w-full gap-8">
          {/* Dynamic Red/Orange Brand launcher at the top */}
          <div 
            onClick={() => setActiveTab('Overview')}
            className="w-12 h-12 bg-[#FF6F3C] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF6F3C]/30 transition-all duration-300 hover:scale-105 cursor-pointer relative group"
          >
            <Rocket className="text-amber-300 w-5 h-5" />
            <div className="absolute left-16 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-white text-[10px] font-extrabold rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50">
              TalentHub Recruit
            </div>
          </div>

          {/* Navigation Icons Dock */}
          <nav className="flex flex-col gap-3 w-full px-3">
            {sidebarItems.map((item, idx) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 relative group cursor-pointer ${
                    isActive 
                      ? 'bg-[#E15A2B] text-white shadow-lg shadow-[#E15A2B]/20' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                  }`}
                  id={`nav-desktop-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  
                  {/* Floating Notification Badge Over Icon */}
                  {item.count && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[9px] font-black px-1.5 min-w-4 h-4 flex items-center justify-center rounded-full border border-zinc-950 shadow-sm">
                      {item.count}
                    </span>
                  )}
                  
                  {/* Tooltip on hovering icon */}
                  <div className="absolute left-16 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-white text-[11px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-3 group-hover:translate-x-0 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile avatar & quick action at the bottom of the rail */}
        <div className="flex flex-col items-center gap-5 w-full">
          <div 
            onClick={() => setActiveTab('Profile Settings')}
            className="relative cursor-pointer group"
          >
            <Avatar className="w-10 h-10 rounded-2xl ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-900 border border-zinc-800 shadow-lg">
              <AvatarImage src={user.avatar} referrerPolicy="no-referrer" />
              <AvatarFallback className="font-bold text-xs">TH</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
            <div className="absolute left-16 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-white text-[11px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-3 group-hover:translate-x-0 whitespace-nowrap z-50">
              {user.name} ({user.companyName || 'Acme'})
            </div>
          </div>

          <button 
            onClick={handleSignOutDirect}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-zinc-900/50 transition-all cursor-pointer group relative"
          >
            <LogOut className="w-4 h-4" />
            <div className="absolute left-16 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-white text-[11px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-3 group-hover:translate-x-0 whitespace-nowrap z-50">
              Sign Out
            </div>
          </button>
        </div>
      </aside>

      {/* 2. OVERLAYING / SLIDING COMPARTMENT NEXT TO THE ICON RAIL */}
      <motion.div
        initial={false}
        animate={{ width: isMenuExpanded ? 240 : 0, opacity: isMenuExpanded ? 1 : 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 210 }}
        className="hidden lg:flex flex-col bg-white border-r border-zinc-200 h-screen fixed left-20 top-0 z-20 overflow-hidden select-none"
      >
        <div className="w-[240px] flex flex-col justify-between h-full p-6">
          <div className="space-y-6 flex-1 overflow-y-auto min-h-0 no-scrollbar pr-1">
            {/* Header / Brand Title section */}
            <div>
              <span className="font-extrabold tracking-tight text-base text-zinc-900 block truncate">TalentHub</span>
              <span className="text-[9px] font-bold text-zinc-400 block uppercase tracking-wider mt-0.5">Recruiter Console</span>
            </div>

            {/* Quick Organization Status Container */}
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 flex items-center gap-2.5">
              <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-bold text-xs rounded-lg uppercase shrink-0">
                {(user.companyName || 'C').substring(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-900 truncate leading-none">{user.companyName || 'Acme Corp'}</p>
                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block animate-pulse"></span> Online
                </p>
              </div>
            </div>

            {/* Expanded items labels list */}
            <nav className="space-y-1">
              {sidebarItems.map((item, idx) => {
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-100 text-zinc-950 font-extrabold' 
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
                    }`}
                    id={`nav-desktop-label-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <span className="text-xs tracking-tight">{item.name}</span>
                    {item.count && (
                      <Badge className={`rounded-md px-1.5 py-0 text-[9px] font-bold border-none ${
                        isActive ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-650'
                      }`}>
                        {item.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <p className="text-[10px] text-zinc-400 font-bold text-center uppercase tracking-wider">Console Portal © 2026</p>
          </div>
        </div>
      </motion.div>

      {/* CORE CONTENT CANVAS (OFFSET ON DESKTOP DYNAMICALLY FOR THE EXPANDED SIDEBAR) */}
      <main className={`flex-1 w-full min-h-screen flex flex-col transition-all duration-300 ${isMenuExpanded ? 'lg:pl-[320px]' : 'lg:pl-20'}`}>
        
        {/* DESKTOP INTEGRATED HEADER NAVBAR (FEATURING THE PILL TOGGLE BUTTON ENHANCEMENT) */}
        <header className="hidden lg:flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-10 w-full select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuExpanded(!isMenuExpanded)}
              className="flex items-center gap-2 border border-zinc-300 bg-zinc-950 text-white hover:bg-zinc-900 active:scale-95 rounded-full px-5 py-2 text-xs font-black transition-all duration-200 shadow-md shadow-zinc-950/10 cursor-pointer"
            >
              <PanelLeft className={`w-4 h-4 transition-transform duration-200 ${isMenuExpanded ? 'rotate-180' : ''}`} />
              <span>Menu</span>
            </button>
            <span className="text-zinc-300 text-sm font-semibold mx-3">|</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              <span>TalentHub</span>
              <ChevronRight className="w-3 h-3 text-zinc-300" />
              <span className="text-zinc-900 font-extrabold">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-extrabold text-zinc-400 capitalize">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-zinc-700">{user?.companyName || 'Acme'} Recruiter Mode</span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-1">
          
          <AnimatePresence mode="wait">
                       {/* 1. OVERVIEW TAB PANEL */}
            {activeTab === 'Overview' && (
              <motion.div key="Overview" {...workspaceAnimate} className="space-y-8">
                {/* Visual Recruiter Welcome Header banner */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 px-2 py-0.5 rounded">
                        Portal Rekrutmen
                      </span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight" id="greeting-title">
                      Selamat Datang Kembali, <span className="text-[#E15A2B]">{companyName}</span>!
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1" id="greeting-desc">
                      Kelola order rekrutmen, pantau status kandidat, dan kurasi shortlist dengan cepat.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => {
                        setOrderStep(1); // reset step
                        setActiveTab('Buat Order Baru');
                      }}
                      className="bg-[#E15A2B] hover:bg-[#c9491d] text-white rounded-full h-11 px-6 font-bold shadow-lg shadow-[#E15A2B]/15 text-xs flex items-center gap-2 transition-all cursor-pointer transform active:scale-95"
                      id="header-create-order-btn"
                    >
                      <Plus className="w-4 h-4" /> Buat Order Baru
                    </Button>
                  </div>
                </div>

                {/* EMPAT ANGKA RINGKASAN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="summary-states-grid">
                  {[
                    { 
                      label: 'Total Order Dibuat', 
                      value: totalOrders, 
                      subtitle: 'Semua riwayat pengajuan', 
                      icon: Briefcase, 
                      color: 'bg-zinc-150 text-zinc-900 border-zinc-250',
                      badgeColor: 'bg-zinc-100 text-zinc-900',
                      id: "stat-total-order"
                    },
                    { 
                      label: 'Sedang Aktif', 
                      value: activeOrdersCount, 
                      subtitle: 'Proses pencarian talenta', 
                      icon: Rocket, 
                      color: 'bg-emerald-50 text-emerald-800 border-emerald-150',
                      badgeColor: 'bg-emerald-100 text-emerald-800',
                      id: "stat-aktif-order"
                    },
                    { 
                      label: 'Sudah Selesai', 
                      value: completedOrdersCount, 
                      subtitle: 'Posisi berhasil terisi', 
                      icon: Check, 
                      color: 'bg-blue-50 text-blue-800 border-blue-150',
                      badgeColor: 'bg-blue-100 text-blue-800',
                      id: "stat-selesai-order"
                    },
                    { 
                      label: 'Butuh Tindakan', 
                      value: alertOrdersCount, 
                      subtitle: 'Review shortlist/keputusan', 
                      icon: AlertCircle, 
                      color: 'bg-red-50 text-red-800 border-red-150',
                      badgeColor: 'bg-red-100 text-red-800' + (alertOrdersCount > 0 ? ' animate-pulse' : ''),
                      id: "stat-tindakan-order"
                    },
                  ].map((stat, i) => (
                    <Card key={i} id={stat.id} className={`rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${stat.color}`}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider">{stat.label}</span>
                          <div className={`p-2 rounded-xl border border-current/15 ${stat.badgeColor}`}>
                            <stat.icon className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-4xl font-black tracking-tight tabular-nums">{stat.value}</span>
                          <p className="text-[10px] opacity-80 font-medium">{stat.subtitle}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* BANNER PERINGATAN (KUNING & HIJAU) */}
                <div className="grid grid-cols-1 gap-4" id="alert-banners-container">


                  {/* Banner Hijau - Link Shortlist hampir expired */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                    id="banner-link-expired"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl mt-0.5">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">Masa Aktif Tautan</span>
                        <p className="text-sm font-semibold text-emerald-900">
                          Tautan eksternal shortlist posisi <strong className="font-extrabold text-emerald-955">Senior Fullstack Developer</strong> hampir expired dalam 24 jam.
                        </p>
                        <p className="text-xs text-emerald-700 mt-1">
                          Klien atau tim eksternal Anda tidak akan bisa mengakses profil kandidat setelah tautan habis masa berlaku.
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => toast.success("Masa aktif tautan eksternal diperpanjang selama 7 hari tambahan!")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl h-9 px-4 font-bold text-xs gap-1.5 shrink-0 self-end md:self-center cursor-pointer shadow-sm transition-all"
                      id="action-extend-link-btn"
                    >
                      Perpanjang Tautan <Check className="w-3.5 h-3.5" />
                    </Button>
                  </motion.div>
                </div>

                {/* 2-COLUMN BOTTOM LAYOUT: 5 ORDER TERBARU & TOMBOL BESAR ORDER PERSISTEN */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8" id="overview-details-section">
                  {/* Left Column: Daftar 5 Order Terbaru */}
                  <div className="xl:col-span-2">
                    <Card className="rounded-2xl border-zinc-200 shadow-sm overflow-hidden bg-white" id="latest-orders-card">
                      <div className="border-b border-zinc-100 p-6 flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-extrabold text-zinc-900">5 Order Rekrutmen Terbaru</h4>
                          <p className="text-xs text-zinc-400">Order terbaru yang diajukan beserta status kelancarannya.</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold py-1 px-2.5 bg-zinc-50 border-zinc-250">
                          Total {orders.length} Order
                        </Badge>
                      </div>
                      <CardContent className="p-0 overflow-x-auto no-scrollbar">
                        <Table id="orders-summary-table">
                          <TableHeader>
                            <TableRow className="border-zinc-100 bg-zinc-50/50">
                              <TableHead className="font-bold text-xs pl-6 h-11">Order Rekrutmen</TableHead>
                              <TableHead className="font-bold text-xs h-11">Departemen</TableHead>
                              <TableHead className="font-bold text-xs h-11">Estimasi Gaji</TableHead>
                              <TableHead className="font-bold text-xs h-11">Tanggal Dibuat</TableHead>
                              <TableHead className="font-bold text-xs text-center h-11">Pembayaran</TableHead>
                              <TableHead className="font-bold text-xs text-right pr-6 h-11">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.slice(0, 5).map((order) => (
                              <TableRow key={order.id} className="group hover:bg-zinc-50/50 border-zinc-100 transition-colors">
                                <TableCell className="pl-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8.5 h-8.5 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-bold text-[10px] shadow-sm">
                                      {order.id}
                                    </div>
                                    <div>
                                      <span className="font-bold text-zinc-900 text-sm block leading-tight">{order.title}</span>
                                      <span className="text-[10px] text-zinc-400 font-bold block mt-1">{order.type}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-zinc-600 font-bold text-xs">{order.dept}</TableCell>
                                <TableCell className="text-zinc-550 font-bold text-xs">{order.salary}</TableCell>
                                <TableCell className="text-zinc-400 font-medium text-xs">
                                  {order.createdAt}
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="inline-flex items-center gap-2">
                                    {order.paymentStatus === 'Paid' ? (
                                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full px-2.5 py-1 font-bold text-[10px] shadow-none flex items-center gap-1">
                                        <Check className="w-3 h-3 text-emerald-600" /> Paid
                                      </Badge>
                                    ) : (
                                      <div className="inline-flex items-center gap-1.5">
                                        <Badge className="bg-rose-50 text-rose-700 border border-rose-250 rounded-full px-2.5 py-1 font-bold text-[10px] shadow-none flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3 text-rose-505 animate-pulse" /> Unpaid
                                        </Badge>
                                        <button
                                          onClick={() => handlePayOrder(order.id)}
                                          className="text-[9px] font-black bg-[#E15A2B] hover:bg-[#c9491d] text-white px-2 py-1 rounded-lg transition-all transform active:scale-95 shadow-sm hover:shadow cursor-pointer flex items-center justify-center"
                                        >
                                          Bayar
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                  <Badge 
                                    className={`rounded-full px-2.5 py-1 border-none font-bold text-[10px] capitalize shadow-none inline-flex items-center gap-1 ${
                                      order.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 
                                      order.status === 'Selesai' ? 'bg-blue-50 text-blue-700' : 
                                      'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                                      order.status === 'Aktif' ? 'bg-emerald-500 animate-pulse' : 
                                      order.status === 'Selesai' ? 'bg-blue-500' : 
                                      'bg-amber-500'
                                    }`}></span>
                                    {order.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column: ALWAYS VISIBLE GIANT ACTION CARD & QUICK STATISTICS */}
                  <div className="xl:col-span-1 space-y-6" id="persistent-actions-sidebar">
                    {/* ALWAYS VISIBLE BIG BUTTON PROMOTIONAL CARD */}
                    <Card className="rounded-[2rem] border-2 border-zinc-900 p-6 bg-zinc-950 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group min-h-[290px]" id="giant-order-promo-card">
                      <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-500 text-zinc-950 border-none rounded-full px-2.5 py-0.5 font-black text-[9px] uppercase tracking-wider">
                            TALENT SELECTION
                          </span>
                        </div>
                        <h4 className="font-black text-xl tracking-tight leading-tight">
                          Butuh tim tambahan atau posisi khusus baru?
                        </h4>
                        <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                          Buat pengajuan order lowongan rekrutmen baru sekarang. Kurator TalentHub akan langsung mengumpulkan kandidat premium dalam 24 jam!
                        </p>
                      </div>

                      {/* THE BIG CTA BUTTON THAT IS ALWAYS VISIBLE */}
                      <button 
                        onClick={() => {
                          setOrderStep(1); // reset step
                          setActiveTab('Buat Order Baru');
                        }}
                        className="mt-6 w-full bg-[#E15A2B] hover:bg-[#ff6c37] active:scale-98 text-white rounded-2xl py-4 px-6 text-sm font-black flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg shadow-[#E15A2B]/20 select-none relative z-10"
                        id="giant-create-order-button"
                      >
                        <Plus className="w-5 h-5 text-white animate-bounce" />
                        <span>BUAT ORDER BARU SEKARANG</span>
                      </button>

                      {/* Styling layout accents */}
                      <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-[#E15A2B]/10 rounded-full blur-2xl transition-all group-hover:scale-125" />
                      <Rocket className="absolute -bottom-4 -left-4 w-24 h-24 text-white/[0.03] -rotate-12" />
                    </Card>

                    {/* Quick guidelines summary card */}
                    <Card className="rounded-2xl border-zinc-200 border-dashed border bg-white p-5 shadow-sm" id="recruitment-flow-guide">
                      <h5 className="font-bold text-xs text-zinc-800 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Alur Pemrosesan Order
                      </h5>
                      <ol className="text-xs text-zinc-500 space-y-2.5 list-decimal pl-4 font-medium">
                        <li>
                          <strong className="text-zinc-800">Submit:</strong> Isikan posisi yang ingin di-hire lewat formulir.
                        </li>
                        <li>
                          <strong className="text-zinc-800">Kurasi:</strong> Engine AI TalentHub beserta profesional recruiter menjaring candidate pool.
                        </li>
                        <li>
                          <strong className="text-zinc-800">Notifikasi Shortlist:</strong> Anda memperoleh banner hijau/kuning saat kandidat siap dikurasi.
                        </li>
                      </ol>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 1B. BUAT ORDER BARU TAB PANEL (3 STEPS FORM) */}
            {activeTab === 'Buat Order Baru' && (
              <motion.div key="BuatOrderBaru" {...workspaceAnimate} className="space-y-8 max-w-4xl mx-auto">
                
                {/* Header Area */}
                <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Formulir Order Rekrutmen Baru</h2>
                    <p className="text-xs text-zinc-500 mt-1">Lengkapi form 3 langkah untuk mempublikasikan order dan diprioritaskan oleh tim kurator kami.</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab('Overview')}
                    className="rounded-full hover:bg-zinc-100 text-zinc-650 hover:text-zinc-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Undo className="w-4 h-4" /> Batal & Kembali
                  </Button>
                </div>

                {/* Step Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2" id="order-step-indicators">
                  {[
                    { number: 1, title: 'Detail Posisi', desc: 'Detail posisi & tipe penempatan' },
                    { number: 2, title: 'Kriteria Kandidat', desc: 'Skills, exp & budget gaji' },
                    { number: 3, title: 'Invoice Pembayaran', desc: 'Rincian invoice & pelunasan' }
                  ].map((s) => {
                    const isPassed = orderStep > s.number;
                    const isCurrent = orderStep === s.number;
                    return (
                      <div
                        key={s.number}
                        className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                          isCurrent 
                            ? 'border-zinc-900 bg-zinc-950 text-white shadow-md' 
                            : isPassed
                              ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900'
                              : 'border-zinc-200 bg-white text-zinc-400'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          isCurrent 
                            ? 'bg-[#E15A2B] text-white' 
                            : isPassed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-zinc-100 text-zinc-400'
                        }`}>
                          {isPassed ? <Check className="w-3.5 h-3.5" /> : s.number}
                        </span>
                        <div>
                          <p className="text-xs font-black tracking-tight leading-none mb-1">{s.title}</p>
                          <p className={`text-[10px] font-medium leading-none ${isCurrent ? 'text-zinc-400' : isPassed ? 'text-emerald-700' : 'text-zinc-405'}`}>
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Form Panels based on step */}
                <div className="bg-white border-2 border-zinc-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
                  
                  {/* STEP 1: DETAIL POSISI */}
                  {orderStep === 1 && (
                    <div className="space-y-6" id="form-step-1">
                      <div className="pb-4 border-b border-zinc-100">
                        <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                          <span className="p-1.5 bg-[#E15A2B]/10 text-[#E15A2B] rounded-lg">
                            <Briefcase className="w-4 h-4" />
                          </span>
                          Langkah 1: Detail Posisi Pekerjaan
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium mt-1">Sediakan informasi pokok menganai peran yang sedang tim Anda butuhkan.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-zinc-700 flex items-center gap-1">
                            Nama Posisi Pekerjaan <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Senior Fullstack Engineer"
                            value={orderPosTitle}
                            onChange={(e) => setOrderPosTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-bold text-zinc-900 transition-all placeholder:text-zinc-400"
                            id="step1-title"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-zinc-700">Departemen Utama</label>
                            <select
                              value={orderPosDept}
                              onChange={(e) => setOrderPosDept(e.target.value)}
                              className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none font-bold text-zinc-950 transition-all"
                              id="step1-dept"
                            >
                              <option value="Engineering">Engineering / IT</option>
                              <option value="Design">Visual Design / UIUX</option>
                              <option value="Product">Product Management</option>
                              <option value="Marketing">Marketing & Business</option>
                              <option value="HR & Operations">HR & Operations</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-black text-zinc-700">Jumlah Orang Dibutuhkan <span className="text-rose-500">*</span></label>
                            <input
                              type="number"
                              min="1"
                              max="50"
                              required
                              value={orderPosHeadcount}
                              onChange={(e) => setOrderPosHeadcount(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-bold text-zinc-900 transition-all"
                              id="step1-headcount"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-zinc-700">Jenis Pekerjaan</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'onsite' as const, label: 'Onsite' },
                              { value: 'hybrid' as const, label: 'Hybrid' },
                              { value: 'remote' as const, label: 'Remote' }
                            ].map((opt) => {
                              const isSelected = orderPosJobType === opt.label;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setOrderPosJobType(opt.label)}
                                  className={`py-3 px-2 rounded-2xl border transition-all cursor-pointer font-bold text-xs ${
                                    isSelected 
                                      ? 'bg-zinc-900 text-white border-zinc-900' 
                                      : 'bg-zinc-50/55 text-zinc-650 border-zinc-200 hover:border-zinc-300'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black text-zinc-700">Kota Penempatan <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Jakarta Selatan, Surabaya, Remote dsb"
                            value={orderPosLocation}
                            onChange={(e) => setOrderPosLocation(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-bold text-zinc-900 transition-all placeholder:text-zinc-400"
                            id="step1-location"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-700">Deskripsi Pekerjaan <span className="text-rose-500">*</span></label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Sebutkan tanggung jawab utama, tugas harian, ekspektasi, dsb..."
                          value={orderPosDescription}
                          onChange={(e) => setOrderPosDescription(e.target.value)}
                          className="w-full px-4 py-3.5 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-bold text-zinc-900 transition-all placeholder:text-zinc-400"
                          id="step1-description"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-700">Catatan Tambahan (Opsional)</label>
                        <textarea
                          rows={2}
                          placeholder="Kriteria pelengkap seperti visa jaminan, tes kemahiran, dll..."
                          value={orderPosNotes}
                          onChange={(e) => setOrderPosNotes(e.target.value)}
                          className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-bold text-zinc-900 transition-all placeholder:text-zinc-400"
                          id="step1-notes"
                        />
                      </div>

                      <div className="flex justify-end pt-6 border-t border-zinc-100">
                        <Button
                          type="button"
                          onClick={() => {
                            if (!orderPosTitle.trim()) {
                              toast.error('Gagal melangkah: Mohon isi nama posisi pekerjaan terlebih dahulu.');
                              return;
                            }
                            if (!orderPosLocation.trim()) {
                              toast.error('Gagal melangkah: Mohon isi lokasi penempatan kerja.');
                              return;
                            }
                            if (!orderPosDescription.trim()) {
                              toast.error('Gagal melangkah: Mohon berikan ringkasan deskripsi tugas.');
                              return;
                            }
                            setOrderStep(2);
                          }}
                          className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-8 h-12 font-bold text-xs shadow-lg shadow-zinc-900/15 flex items-center gap-2 cursor-pointer transition-all"
                          id="step1-next-btn"
                        >
                          Lanjut ke Kriteria Kandidat <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: KRITERIA KANDIDAT */}
                  {orderStep === 2 && (
                    <div className="space-y-6" id="form-step-2">
                      <div className="pb-4 border-b border-zinc-100">
                        <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                          <span className="p-1.5 bg-[#E15A2B]/10 text-[#E15A2B] rounded-lg">
                            <Users className="w-4 h-4" />
                          </span>
                          Langkah 2: Kriteria & Kualifikasi Talenta
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium mt-1">Tentukan standardisasi tim kurasi dalam memfilter profil kandidat ideal.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-zinc-700">Rentang Pengalaman Kerja</label>
                          <select
                            value={orderCritExp}
                            onChange={(e) => setOrderCritExp(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none font-bold text-zinc-950 transition-all"
                            id="step2-exp"
                          >
                            <option value="Intern / Fresh Graduate">Magang / Pengalaman &lt; 1 Tahun</option>
                            <option value="1-3 tahun">Junior (1 - 3 Tahun)</option>
                            <option value="3-5 tahun">Middle-tier (3 - 5 Tahun)</option>
                            <option value="5-8 tahun">Senior-level (5 - 8 Tahun)</option>
                            <option value="8+ tahun">Lead / Principal Expert (8+ Tahun)</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-zinc-700">Pendidikan Minimal</label>
                            <select
                              value={orderCritMinEdu}
                              onChange={(e) => setOrderCritMinEdu(e.target.value)}
                              className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none font-bold text-zinc-950 transition-all"
                              id="step2-education"
                            >
                              <option value="Semua Tingkat">Semua Tingkat (Keahlian &gt; Ijazah)</option>
                              <option value="SMA/SMK">Minimum SMA / SMK / Sederajat</option>
                              <option value="D3">Minimum Diploma (D3)</option>
                              <option value="S1">Minimum Sarjana (S1 / Bachelor)</option>
                              <option value="S2">Minimum Magister (S2 / Master)</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-black text-zinc-700">Program Studi / Jurusan</label>
                            <input
                              type="text"
                              placeholder="Contoh: Teknik Informatika / Apapun"
                              value={orderCritMajor}
                              onChange={(e) => setOrderCritMajor(e.target.value)}
                              className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-bold text-zinc-900 transition-all placeholder:text-zinc-400"
                              id="step2-major"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-700 flex items-center justify-between">
                          <span>Skills Pokok yang Dibutuhkan (Pisahkan dengan koma) <span className="text-rose-500">*</span></span>
                          <span className="text-[10px] text-[#E15A2B] font-bold">Misal: React, TypeScript, Node.js</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="React, TypeScript, Tailwind CSS, Docker, Golang"
                          value={orderCritSkills}
                          onChange={(e) => setOrderCritSkills(e.target.value)}
                          className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-bold text-zinc-900 transition-all placeholder:text-zinc-400"
                          id="step2-skills"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {orderCritSkills.split(',').map((s) => s.trim()).filter(Boolean).map((skill, idx) => (
                            <Badge key={idx} className="bg-zinc-150 text-zinc-750 font-bold text-[10px] py-1 border-none rounded">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-700">Estimasi Anggaran Gaji Bulanan (Budget) <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Misal: Rp 15.000.000 - Rp 25.000.000"
                          value={orderCritSalaryBudget}
                          onChange={(e) => setOrderCritSalaryBudget(e.target.value)}
                          className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-bold text-zinc-900 transition-all placeholder:text-zinc-400"
                          id="step2-salary"
                        />
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t border-zinc-100">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setOrderStep(1)}
                          className="rounded-full px-6 text-zinc-500 font-bold hover:text-zinc-900 text-xs h-12 cursor-pointer transition-colors"
                        >
                          Kembali Ke Langkah 1
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            if (!orderCritSkills.trim()) {
                              toast.error('Gagal menyimpan: Minimal masukkan 1 kualifikasi skill.');
                              return;
                            }
                            if (!orderCritSalaryBudget.trim()) {
                              toast.error('Gagal menyimpan: Berikan perkiraan anggaran gaji untuk lowongan ini.');
                              return;
                            }
                            handleCreateOrderMultiStep();
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12 font-bold text-xs shadow-lg shadow-emerald-500/15 flex items-center gap-1.5 cursor-pointer transition-all"
                          id="step2-submit-btn"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Simpan Data & Buat Invoice
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: INVOICE PEMBAYARAN */}
                  {orderStep === 3 && completedOrderForInvoice && (
                    <div className="space-y-6" id="form-step-3">
                      
                      {/* Success / Database Submission Banner */}
                      <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-2xl flex items-start gap-3 no-print">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-emerald-950">Data Order Sourcing Berhasil Dikirim ke Database!</p>
                          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                            ID: <span className="underline font-black">{completedOrderForInvoice.id}</span> terdaftar sebagai Unpaid di sistem. Kurasi premium akan dimulai segera setelah konfirmasi pembayaran diterima.
                          </p>
                        </div>
                      </div>

                      {/* Interactive Visual Invoice Receipt */}
                      <div ref={invoiceRef} className="border border-zinc-250 shadow-lg rounded-[2rem] bg-white overflow-hidden" id="invoice-bill-card">
                        
                        {/* Header Invoice */}
                        <div className="bg-zinc-950 p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-black bg-[#E15A2B] text-white px-2.5 py-1 rounded-md">
                              INVOICE RESMI
                            </span>
                            <h4 className="text-xl font-black tracking-tight mt-2">TalentHub Recruitment Services</h4>
                            <p className="text-[10px] text-zinc-400 font-medium">Layanan Rekrutmen Instan Khusus Perusahaan High-Scale</p>
                          </div>
                          
                          <div className="text-left md:text-right">
                            <p className="text-[10px] text-zinc-400 font-bold">Ref Order</p>
                            <p className="text-xs font-black tracking-widest text-[#E15A2B]">{completedOrderForInvoice.id}</p>
                            <p className={`text-[10px] font-black mt-2 border px-2 py-0.5 rounded inline-block ${
                              completedOrderForInvoice.paymentStatus === 'Paid'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-555'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                            }`}>
                              STATUS: {completedOrderForInvoice.paymentStatus === 'Paid' ? 'PAID (LUNAS)' : 'UNPAID (BELUM DIBAYAR)'}
                            </p>
                          </div>
                        </div>

                        {/* Invoice Metadata Body */}
                        <div className="p-6 md:p-8 space-y-6">
                          <div className="grid grid-cols-2 gap-4 text-xs select-none">
                            <div>
                              <p className="text-zinc-400 font-bold uppercase text-[9px] mb-1">DITAGIHKAN KEPADA</p>
                              <p className="font-extrabold text-zinc-900">{companyName}</p>
                              <p className="font-medium text-zinc-500 mt-0.5">{location}</p>
                              <p className="font-medium text-zinc-500">{email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-zinc-400 font-bold uppercase text-[9px] mb-1">DETAIL TRANSAKSI</p>
                              <p className="font-semibold text-zinc-800"><strong className="text-zinc-900">Tanggal:</strong> {completedOrderForInvoice.createdAt}</p>
                              <p className="font-semibold text-zinc-800"><strong className="text-zinc-900">Jatuh Tempo:</strong> Hari Ini ({completedOrderForInvoice.createdAt})</p>
                              <p className="font-semibold text-zinc-800"><strong className="text-zinc-900">Metode:</strong> VA Bank Transfer Otomatis</p>
                            </div>
                          </div>

                          {/* Line items listed Table */}
                          <div className="border border-zinc-200 rounded-2xl overflow-x-auto no-scrollbar">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-extrabold select-none">
                                <tr>
                                  <th className="p-3">Rincian Deskripsi Jasa rekrutmen</th>
                                  <th className="p-3 text-center">Bulan Sourcing</th>
                                  <th className="p-3 text-right">Harga Satuan</th>
                                  <th className="p-3 text-right pr-4">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100 font-bold text-zinc-850">
                                <tr>
                                  <td className="p-3 text-zinc-900">
                                    <p className="text-zinc-950 font-black">{completedOrderForInvoice.title}</p>
                                    <p className="text-[10px] text-zinc-400 font-semibold">{completedOrderForInvoice.dept} · {completedOrderForInvoice.type} · {orderPosHeadcount} Posisi Dicari</p>
                                  </td>
                                  <td className="p-3 text-center text-zinc-600">1 Bulan (SLA)</td>
                                  <td className="p-3 text-right text-zinc-600">Rp 9.500.000</td>
                                  <td className="p-3 text-right pr-4">Rp 9.500.000</td>
                                </tr>
                                <tr>
                                  <td className="p-3 text-zinc-900">
                                    <p className="text-zinc-950 font-black">Startup AI Setup Fee</p>
                                    <p className="text-[10px] text-zinc-400 font-semibold">Integrasi database & auto-categorization</p>
                                  </td>
                                  <td className="p-3 text-center text-zinc-600">-</td>
                                  <td className="p-3 text-right text-zinc-650">Rp 250.000</td>
                                  <td className="p-3 text-right pr-4 text-zinc-650">Rp 250.000</td>
                                </tr>
                                <tr>
                                  <td className="p-3 text-zinc-900">
                                    <p className="text-zinc-950 font-black">SLA Priority Queue Fee</p>
                                    <p className="text-[10px] text-zinc-400 font-semibold">Antrean prioritas utama kurator utama</p>
                                  </td>
                                  <td className="p-3 text-center text-zinc-600">-</td>
                                  <td className="p-3 text-right text-zinc-650">Rp 250.000</td>
                                  <td className="p-3 text-right pr-4 text-zinc-650">Rp 250.000</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Sum block */}
                          <div className="flex justify-end pt-4 select-none">
                            <div className="w-full max-w-xs space-y-1.5 text-xs text-right">
                              <div className="flex justify-between text-zinc-500 font-extrabold">
                                <span>Subtotal:</span>
                                <span>Rp 10.000.000</span>
                              </div>
                              <div className="flex justify-between text-zinc-500 font-extrabold">
                                <span>PPN (0% Tarif Khusus Corporate):</span>
                                <span>Rp 0</span>
                              </div>
                              <div className="flex justify-between text-zinc-950 text-sm font-black border-t border-zinc-200 pt-2">
                                <span>Total Tagihan:</span>
                                <span>Rp 10.000.000</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Payment Selection Gate */}
                        <div className="p-6 md:p-8 bg-zinc-50 border-t border-zinc-200 space-y-4">
                          <p className="text-xs font-black text-zinc-805">Selesaikan Pembayaran Tagihan:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-white p-4 rounded-xl border-2 border-zinc-950 flex flex-col justify-between">
                              <span className="text-xs font-black text-zinc-900 block">Bank Central Asia (BCA) VA</span>
                              <span className="text-[10.5px] text-[#E15A2B] font-black mt-2 tracking-widest">8041 0223 4561 2291</span>
                              <span className="text-[9px] text-zinc-450 font-semibold mt-1">An. PT TalentHub Global</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-zinc-200 opacity-60 flex flex-col justify-between select-none">
                              <span className="text-xs font-black text-zinc-400">Bank Mandiri VA</span>
                              <span className="text-[10px] text-zinc-400 font-semibold mt-2 tracking-widest font-mono">8891 0000 1234 445</span>
                              <span className="text-[9px] text-zinc-400 font-semibold">An. PT TalentHub Global</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-zinc-200 opacity-60 flex flex-col justify-between select-none">
                              <span className="text-xs font-black text-zinc-400">Gopay / QRIS Instan</span>
                              <span className="text-[10px] text-zinc-400 font-semibold mt-2">Scan QR code dinamis</span>
                              <span className="text-[9px] text-zinc-400 font-semibold">Settle otomatis</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-end items-center pt-4 no-print">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            // Reset local step values
                            setOrderPosTitle('');
                            setOrderPosHeadcount(1);
                            setOrderPosDescription('');
                            setOrderPosNotes('');
                            setOrderStep(1);
                            setActiveTab('Overview');
                          }}
                          className="rounded-full px-6 text-zinc-550 font-bold hover:text-zinc-900 text-xs h-12 cursor-pointer transition-colors w-full sm:w-auto"
                        >
                          Bayar Nanti & Kembali ke Overview
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrintInvoice}
                          className="rounded-full px-6 border border-zinc-200 text-zinc-700 font-extrabold hover:text-zinc-900 text-xs h-12 cursor-pointer transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto bg-white hover:bg-zinc-50"
                        >
                          <Printer className="w-4 h-4 text-zinc-500" />
                          <span>Unduh / Cetak Invoice (PDF)</span>
                        </Button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsProcessingPayment(true);
                            setTimeout(() => {
                              // Mark that order as Paid in the state list!
                              setOrders(prev => prev.map(o => {
                                if (o.id === completedOrderForInvoice.id) {
                                  return { ...o, paymentStatus: 'Paid' };
                                }
                                return o;
                              }));
                              
                              // Update local completedOrderForInvoice ref state so the UI stamps changes as Paid
                              setCompletedOrderForInvoice(prev => prev ? { ...prev, paymentStatus: 'Paid' } : null);
                              setIsProcessingPayment(false);
                              toast.success(`Pembayaran ${completedOrderForInvoice.id} sebesar Rp 10.000.000 Berhasil Dikonfirmasi!`);
                            }, 1500);
                          }}
                          disabled={isProcessingPayment || completedOrderForInvoice.paymentStatus === 'Paid'}
                          className={`rounded-full h-12 px-8 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer min-w-[200px] w-full sm:w-auto ${
                            completedOrderForInvoice.paymentStatus === 'Paid'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10'
                              : 'bg-zinc-950 hover:bg-zinc-850 text-white shadow-zinc-900/15'
                          }`}
                        >
                          {isProcessingPayment ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                              <span>Memproses Transfer VA...</span>
                            </>
                          ) : completedOrderForInvoice.paymentStatus === 'Paid' ? (
                            <>
                              <Check className="w-4 h-4 text-white" />
                              <span>LUNAS (Paid)</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              <span>Konfirmasi Bayar Rp 10M</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  )}

                </div>

              </motion.div>
            )}

            {/* 2. ACTIVE JOBS TAB PANEL */}
            {activeTab === 'Active Jobs' && (
              <motion.div key="ActiveJobs" {...workspaceAnimate} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-900">Manajemen Lowongan Kerja</h2>
                    <p className="text-xs text-zinc-400">Ubah, perbarui, dan tutup lowongan aktif serta pantau statistik aplikasi masuk.</p>
                  </div>
                  <Button 
                    onClick={() => setIsCreatingJob(true)}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full h-10 px-5 font-bold shadow-lg shadow-zinc-900/15 text-xs flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Publikasikan Lowongan
                  </Button>
                </div>

                {isCreatingJob && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-dashed border-zinc-300 rounded-[2rem] p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" /> Form Penerbitan Lowongan Baru
                      </h4>
                      <Button variant="ghost" size="icon" onClick={() => setIsCreatingJob(false)} className="rounded-xl">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-650 pl-1">Nama / Judul Pekerjaan</label>
                        <input 
                          type="text"
                          required
                          value={newJobTitle}
                          onChange={(e) => setNewJobTitle(e.target.value)}
                          placeholder="Contoh: Senior React Developer"
                          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-medium text-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-650 pl-1">Departemen Utama</label>
                        <select 
                          value={newJobDept} 
                          onChange={(e) => setNewJobDept(e.target.value)}
                          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none font-medium text-zinc-900"
                        >
                          <option value="Engineering">Engineering / Developer</option>
                          <option value="Design">Visual Design / UIUX</option>
                          <option value="Product">Product Management</option>
                          <option value="Marketing">Marketing / Bisnis</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-650 pl-1">Skema Lokasi</label>
                        <input 
                          type="text"
                          required
                          value={newJobLocation}
                          onChange={(e) => setNewJobLocation(e.target.value)}
                          placeholder="Misal: Jakarta / Remote"
                          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-medium text-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-650 pl-1">Rentang Compensasi (Gaji Bulanan)</label>
                        <input 
                          type="text"
                          required
                          value={newJobSalary}
                          onChange={(e) => setNewJobSalary(e.target.value)}
                          placeholder="Contoh: Rp 15M - 25M"
                          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-medium text-zinc-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-650 pl-1">Tipe Kontrak</label>
                        <select 
                          value={newJobType} 
                          onChange={(e) => setNewJobType(e.target.value)}
                          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none font-medium text-zinc-900"
                        >
                          <option value="Full-time">Full-time (Karyawan Tetap)</option>
                          <option value="Contract">Contract (Kontrak/Freelance)</option>
                          <option value="Internship">Internship (Magang)</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => setIsCreatingJob(false)}
                          className="rounded-xl px-5 text-zinc-550 font-bold"
                        >
                          Batalkan
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-zinc-900 text-white rounded-xl h-10 px-6 font-bold text-xs"
                        >
                          Terbitkan Lowongan Kerja
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <Card key={job.id} className="rounded-2xl border-zinc-200 overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4 bg-zinc-50/50 border-b border-zinc-100 p-6">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                              {job.code}
                            </div>
                            <div>
                              <h3 className="text-sm font-extrabold text-zinc-900 leading-none">{job.title}</h3>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1.5">{job.dept}</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[10px] rounded-full">
                            {job.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-xs font-medium text-zinc-500">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {job.type}</span>
                          <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Gaji: {job.salary}</span>
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Pelamar: {job.applicants}</span>
                        </div>
                        <Separator className="bg-zinc-100" />
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-zinc-400 font-semibold italic">Ditambahkan Hari Ini</span>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                toast.info(`Sedang mengirim kuesioner tambahan untuk lowongan ${job.title}...`);
                              }}
                              className="rounded-lg h-8 text-[11px] font-bold border-zinc-200 hover:bg-zinc-100"
                            >
                              Kirim Tes
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteJob(job.id, job.title)}
                              className="h-8 w-8 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. MESSAGES TAB PANEL - HIGH-FIDELITY CHAT SYSTEM */}
            {activeTab === 'Messages' && (
              <motion.div key="Messages" {...workspaceAnimate} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-zinc-900">Kotak Masuk Chat</h2>
                  <p className="text-xs text-zinc-400 font-medium">Lakukan percakapan dua arah secara interaktif dengan kandidat.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-zinc-200 rounded-[2rem] overflow-hidden min-h-[500px] shadow-sm">
                  
                  {/* Candidates Left Sidebar Pane */}
                  <div className="lg:col-span-4 border-r border-zinc-150 flex flex-col h-full bg-zinc-50/30">
                    <div className="p-4 border-b border-zinc-150 bg-white">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                        <input 
                          type="text" 
                          placeholder="Cari chat pelamar..."
                          className="w-full pl-9 pr-4 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50 font-medium text-zinc-900"
                        />
                      </div>
                    </div>
                    {/* Active Candidate Chats Lists */}
                    <div className="divide-y divide-zinc-100 overflow-y-auto max-h-[400px] no-scrollbar">
                      {chatCandidates.map((cand) => {
                        const isSelected = cand.id === selectedChatCandidateId;
                        return (
                          <div
                            key={cand.id}
                            onClick={() => {
                              setSelectedChatCandidateId(cand.id);
                              cand.unread = false; // Mark read simply
                            }}
                            className={`p-4 flex gap-3 cursor-pointer select-none transition-colors ${
                              isSelected ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                            }`}
                          >
                            <div className="relative">
                              <Avatar className="w-10 h-10 border border-zinc-250">
                                <AvatarImage src={cand.avatar} referrerPolicy="no-referrer" />
                                <AvatarFallback className="font-bold text-xs">C</AvatarFallback>
                              </Avatar>
                              {cand.unread && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h6 className="text-xs font-bold text-zinc-900 truncate leading-none mb-1">{cand.name}</h6>
                                <span className="text-[9px] text-zinc-400 font-semibold uppercase leading-none">Live</span>
                              </div>
                              <p className="text-[10px] text-zinc-550 font-semibold truncate leading-none mb-2">{cand.role}</p>
                              <p className="text-[11px] text-zinc-400 truncate leading-snug">{cand.lastMsg}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Message Pane Right Thread */}
                  <div className="lg:col-span-8 flex flex-col justify-between bg-white h-full min-h-[400px]">
                    {/* Convo Header */}
                    {(() => {
                      const activeCand = chatCandidates.find(c => c.id === selectedChatCandidateId);
                      if (!activeCand) return <div className="p-8 text-center text-zinc-400 text-xs">Pilih percakapan terlebih dahulu</div>;
                      return (
                        <>
                          <div className="p-4 border-b border-zinc-150 flex items-center justify-between bg-zinc-50/20">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 border border-zinc-200">
                                <AvatarImage src={activeCand.avatar} referrerPolicy="no-referrer" />
                                <AvatarFallback className="font-bold text-xs">C</AvatarFallback>
                              </Avatar>
                              <div>
                                <h5 className="text-xs font-black text-zinc-900 leading-none mb-1">{activeCand.name}</h5>
                                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{activeCand.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none rounded-full px-2 py-0.5 text-[9px] font-black">Online</Badge>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => {
                                  toast.success(`Profil ${activeCand.name} dikirim ke direktur HRD.`);
                                }}
                                className="h-8 w-8 text-zinc-400 hover:text-zinc-600 rounded-lg"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Message Body stream layout */}
                          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[300px] min-h-[250px] bg-zinc-50/20 no-scrollbar">
                            {(chatMessages[selectedChatCandidateId] || []).map((msg, i) => {
                              const isRecruiter = msg.sender === 'recruiter';
                              return (
                                <div key={i} className={`flex ${isRecruiter ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs shadow-sm ${
                                    isRecruiter 
                                      ? 'bg-zinc-900 text-white rounded-tr-xs' 
                                      : 'bg-white text-zinc-900 border border-zinc-150 rounded-tl-xs'
                                  }`}>
                                    <p className="leading-relaxed font-semibold">{msg.text}</p>
                                    <span className={`text-[9px] text-right block mt-1.5 font-bold ${
                                      isRecruiter ? 'text-zinc-400' : 'text-zinc-400'
                                    }`}>
                                      {msg.time}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Chat footer text area and submit buttons */}
                          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-150 flex gap-2.5 items-center bg-white">
                            <input 
                              type="text"
                              value={typedMessage}
                              onChange={(e) => setTypedMessage(e.target.value)}
                              placeholder="Tulis balasan pesan Anda di sini..."
                              className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-medium text-zinc-900"
                            />
                            <Button 
                              type="submit" 
                              className="bg-zinc-900 text-white hover:bg-zinc-805 rounded-xl h-11 px-5 shadow-sm flex items-center justify-center"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </form>
                        </>
                      );
                    })()}
                  </div>

                </div>
              </motion.div>
            )}

            {/* 4. SHORTLISTED TALENTS TAB */}
            {activeTab === 'Shortlisted Talents' && (
              <motion.div key="Shortlisted" {...workspaceAnimate} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-zinc-900">Talenta Masuk Shortlist</h2>
                  <p className="text-xs text-zinc-400">Calon kandidat terpilih berkompetensi tinggi yang Anda tandai selama pencarian.</p>
                </div>

                {shortlisted.length === 0 ? (
                  <Card className="rounded-[2rem] border-zinc-200 shadow-sm p-12 text-center bg-white flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-50 border border-zinc-100 text-zinc-300 flex items-center justify-center mb-4">
                      <Bookmark className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h4 className="text-lg font-bold text-zinc-900 mb-1">Daftar Shortlist Masih Kosong</h4>
                    <p className="text-zinc-400 text-xs max-w-sm mx-auto mb-6">
                      Jelajahi talent pool berkualitas di menu "Search Talents" dan tandai mereka sebagai calon terbaik perusahaan Anda.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('Search Talents')}
                      className="bg-zinc-900 text-white rounded-full h-10 px-6 font-bold text-xs"
                    >
                      Kunjungi Search Talents
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shortlisted.map((cand) => (
                      <Card key={cand.id} className="rounded-2xl border-zinc-200 overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex gap-4 items-start">
                            <Avatar className="w-12 h-12 border border-zinc-150">
                              <AvatarImage src={cand.avatar} referrerPolicy="no-referrer" />
                              <AvatarFallback className="font-bold text-xs">C</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-black text-zinc-900 truncate">{cand.name}</h4>
                                <span className="text-amber-500 font-bold text-xs flex items-center gap-1">
                                  ★ {cand.rating}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-zinc-500 truncate mt-0.5">{cand.role}</p>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider tracking-medium block mt-1">{cand.location} • {cand.experience} pengalaman</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {cand.skills.map((s, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-zinc-150 text-zinc-700 border-none font-bold text-[9px] rounded-lg">
                                {s}
                              </Badge>
                            ))}
                          </div>

                          <p className="text-xs text-zinc-500 italic leading-relaxed font-semibold bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">
                            "{cand.bio || 'Developer berbakat yang berfokus pada teknologi modern.'}"
                          </p>

                          <Separator className="bg-zinc-100" />

                          <div className="flex justify-between items-center text-xs font-semibold">
                            <div className="text-zinc-400 flex items-center gap-1.5 text-[11px]">
                              <span>Ekspektasi Gaji: </span>
                              <strong className="text-zinc-700 font-bold">{cand.salary}</strong>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toggleShortlist(cand)}
                                className="rounded-lg h-8 text-[11px] font-bold border-zinc-200 hover:text-red-600 hover:bg-neutral-50 px-3"
                              >
                                Hapus
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleInitiateChat(cand)}
                                className="rounded-lg h-8 text-[11px] font-bold bg-zinc-900 text-white hover:bg-zinc-800 px-3 flex items-center gap-1"
                              >
                                <MessageSquare className="w-3.5 h-3.5" /> Chat
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. SEARCH TALENTS WITH INTERACTIVE FILTERING & SHORTLIST ADDITIONS */}
            {activeTab === 'Search Talents' && (
              <motion.div key="SearchTalents" {...workspaceAnimate} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-zinc-900">Jelajahi Kandidat Berkualitas</h2>
                  <p className="text-xs text-zinc-400 font-semibold">Sistem filter tag mempermudah penyaringan skill khusus pengembang secara real-time.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2 bg-transparent select-none">
                  {/* Search field */}
                  <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari kata kunci skill (Figma, React, AWS, PM)..."
                      className="w-full pl-10 pr-4 py-3 text-xs border border-zinc-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white font-semibold text-zinc-900 shadow-sm"
                    />
                  </div>

                  {/* Reset Filters shortcut */}
                  {selectedFilterTag && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedFilterTag(null)}
                      className="text-zinc-650 font-bold border-zinc-200 h-10 px-4 rounded-xl text-xs flex items-center gap-1"
                    >
                      <Undo className="w-3.5 h-3.5" /> Reset Filter Tag ({selectedFilterTag})
                    </Button>
                  )}
                </div>

                {/* Horizontal Skill Quick Filters tags box */}
                <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Saring Berdasarkan Keahlian Utama:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {allSkillsTags.map((tag, idx) => {
                      const isSelected = selectedFilterTag === tag;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedFilterTag(null);
                            } else {
                              setSelectedFilterTag(tag);
                            }
                          }}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold ${
                            isSelected 
                              ? 'bg-zinc-90 w-auto bg-zinc-900 text-white border-zinc-900 shadow-sm' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:border-zinc-350'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Candidate display grid list */}
                {filteredCandidates.length === 0 ? (
                  <Card className="rounded-[2rem] border-zinc-200 shadow-sm p-12 text-center bg-white flex flex-col items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-zinc-300 mb-4" />
                    <h4 className="text-lg font-bold text-zinc-900 mb-1">Kandidat Tidak Ditemukan</h4>
                    <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                      Cobalah merubah pencarian kata kunci atau klik "Reset Filter Tag" keahlian utama di atas.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCandidates.map((cand) => {
                      const isShortlisted = shortlisted.some(s => s.name === cand.name);
                      return (
                        <Card key={cand.id} className="rounded-2xl border-zinc-200 overflow-hidden shadow-sm bg-white hover:shadow-md transition-all flex flex-col justify-between">
                          <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-3.5">
                              {/* Person identity */}
                              <div className="flex gap-3.5 items-start">
                                <Avatar className="w-11 h-11 border border-zinc-150 shadow-sm">
                                  <AvatarImage src={cand.avatar} referrerPolicy="no-referrer" />
                                  <AvatarFallback className="font-bold text-xs">C</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black text-zinc-900 truncate">{cand.name}</h4>
                                    <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5 shrink-0">
                                      ★ {cand.rating}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-bold text-zinc-500 truncate leading-none mt-1">{cand.role}</p>
                                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1.5">{cand.location}</p>
                                </div>
                              </div>

                              {/* Skills */}
                              <div className="flex flex-wrap gap-1">
                                {cand.skills.map((sk, idx2) => (
                                  <Badge key={idx2} variant="secondary" className="bg-zinc-100 text-zinc-650 border-none font-bold text-[8.5px] py-0.5 px-1.5 rounded-md">
                                    {sk}
                                  </Badge>
                                ))}
                              </div>

                              <p className="text-xs text-zinc-400 leading-normal font-medium max-sm:text-[11px] line-clamp-3">
                                "{cand.bio}"
                              </p>
                            </div>

                            {/* Actions footer wrapper nested */}
                            <div className="pt-4 border-t border-zinc-100 space-y-3 mt-4">
                              <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-500">
                                <span>Gaji: <strong className="text-zinc-700 font-bold">{cand.salary}</strong></span>
                                <span>Exp: <strong className="text-zinc-700 font-bold">{cand.experience}</strong></span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => toggleShortlist(cand)}
                                  className={`rounded-lg h-8 text-[11px] font-bold border-zinc-200 transition-colors flex items-center justify-center gap-1 ${
                                    isShortlisted ? 'bg-emerald-50 text-emerald-700 border-none hover:bg-emerald-100' : 'hover:bg-zinc-50'
                                  }`}
                                >
                                  {isShortlisted ? <Check className="w-3.5 h-3.5" /> : null}
                                  {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleInitiateChat(cand)}
                                  className="rounded-lg h-8 text-[11px] font-bold bg-zinc-900 text-white hover:bg-zinc-805 flex items-center justify-center gap-1"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" /> Pesan
                                </Button>
                              </div>
                            </div>

                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* 6. NOTIFICATIONS TAB PANEL */}
            {activeTab === 'Notifications' && (
              <motion.div key="Notifications" {...workspaceAnimate} className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-zinc-200">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-900">Notifikasi Masuk</h2>
                    <p className="text-xs text-zinc-400">Tinjau perkembangan lamaran atau aksi terbaru dari tim TalentHub.</p>
                  </div>
                  {notifications.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setNotifications([]);
                        toast.success('Semua notifikasi dibersihkan.');
                      }}
                      className="rounded-xl border-zinc-200 hover:bg-zinc-100 text-xs font-bold h-9 px-4 text-zinc-500"
                    >
                      Bersihkan Semua
                    </Button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <Card className="rounded-[2rem] border-zinc-200 shadow-sm p-12 text-center bg-white flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-300 flex items-center justify-center mb-4">
                      <Bell className="w-6 h-6 text-zinc-400" />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 mb-1">Tidak Ada Notifikasi Baru</h4>
                    <p className="text-zinc-400 text-xs">Pemberitahuan penting akan ditampilkan di halaman ini.</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <Card key={notif.id} className="rounded-xl border-zinc-100 shadow-sm p-4 bg-white flex relative overflow-hidden items-start gap-4">
                        <div className={`p-2 rounded-xl mt-0.5 ${
                          notif.category === 'message' ? 'bg-blue-50 text-blue-600' :
                          notif.category === 'application' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-zinc-100 text-zinc-650'
                        }`}>
                          {notif.category === 'message' ? <MessageSquare className="w-4 h-4" /> :
                           notif.category === 'application' ? <Users className="w-4 h-4" /> :
                           <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="text-xs font-black text-zinc-900 leading-tight">{notif.title}</h5>
                            <span className="text-[9px] text-zinc-400 font-bold shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-1 block">{notif.desc}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setNotifications(notifications.filter(n => n.id !== notif.id));
                            toast.success('Pemberitahuan dihapus');
                          }}
                          className="h-8 w-8 text-zinc-350 hover:text-red-650 hover:bg-red-50 rounded-lg self-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 7. PROFILE SETTINGS */}
            {activeTab === 'Profile Settings' && (
              <motion.div key="ProfileSettings" {...workspaceAnimate} className="space-y-6">
                <div className="pb-6 border-b border-zinc-200">
                  <h3 className="text-2xl font-bold text-zinc-900">Pengaturan Profil Recruiter</h3>
                  <p className="text-xs text-zinc-400 font-medium select-none">
                    Kelola detail instansi perusahaan, kontak utama, deskripsi profil dan pencitraan rekrutmen.
                  </p>
                </div>

                <Card className="rounded-[2rem] border-zinc-200 shadow-sm bg-white overflow-hidden">
                  <CardContent className="p-8">
                    <form onSubmit={handleSaveProfile} className="space-y-8">
                      {/* Avatar Dynamic Generation */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed || email}`} referrerPolicy="no-referrer" />
                          <AvatarFallback className="font-bold">U</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1 text-center sm:text-left">
                          <h4 className="font-bold text-zinc-800 text-sm">Identitas Visual Avatar</h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold max-w-sm">
                            Hasilkan avatar recruiter otomatis berbasis input seed. Ketik nama unik untuk merubah gambaran avatar.
                          </p>
                          <div className="flex gap-2 max-w-sm mt-1">
                            <input
                              type="text"
                              value={avatarSeed}
                              onChange={(e) => setAvatarSeed(e.target.value)}
                              placeholder="Ketik kata acak..."
                              className="px-3.5 py-1.5 border border-zinc-200 rounded-xl text-xs w-full bg-white outline-none focus:border-zinc-900 font-bold"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="h-8 px-3 text-[10px] font-extrabold rounded-xl border-zinc-200"
                              onClick={() => setAvatarSeed(Math.random().toString(36).substring(3, 8))}
                            >
                              Acak
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Details Fields Inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5 pl-1">
                            <User className="w-3.5 h-3.5 text-zinc-450" /> Nama Lengkap Kontak
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold text-zinc-900"
                            placeholder="Tulis nama Anda"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5 pl-1">
                            <Mail className="w-3.5 h-3.5 text-zinc-445" /> Alamat Email
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            disabled
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs bg-zinc-150 text-zinc-500 font-semibold cursor-not-allowed select-none"
                            placeholder="Alamat email aktif"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5 pl-1">
                            <Building2 className="w-3.5 h-3.5 text-zinc-450" /> Nama Lembaga/Perusahaan
                          </label>
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold text-zinc-900"
                            placeholder="Misal: Acme Corp"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5 pl-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-450" /> Lokasi Kantor Utama
                          </label>
                          <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold text-zinc-900"
                            placeholder="Misal: Jakarta, Indonesia"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5 pl-1">
                            <Phone className="w-3.5 h-3.5 text-zinc-445" /> Nomor Kontak Utama
                          </label>
                          <input
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold text-zinc-900"
                            placeholder="+62 812-xxxx-xxxx"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5 pl-1">
                            <Globe className="w-3.5 h-3.5 text-zinc-445" /> Alamat Website Perusahaan
                          </label>
                          <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold text-zinc-900"
                            placeholder="https://perusahaan.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-650 pl-1">Visi & Misi Budaya Kerja Instansi</label>
                        <textarea
                          rows={4}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold resize-none text-zinc-900"
                          placeholder="Ceritakan sejarah ringkas startup, proyek pengerjaan, atau apa kompetensi yang dihargai perusahaan..."
                        />
                      </div>

                      {/* Action buttons inputs forms */}
                      <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="rounded-full px-6 text-zinc-500 font-bold hover:text-zinc-900 h-11 text-xs"
                          onClick={() => setActiveTab('Overview')}
                        >
                          Batal
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isSaving}
                          className="bg-zinc-900 text-white hover:bg-zinc-805 rounded-full h-11 px-8 font-bold text-xs shadow-lg shadow-zinc-900/15"
                        >
                          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isCreatingOrder && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="bg-white border-2 border-zinc-100 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl relative"
                  id="create-order-modal-container"
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsCreatingOrder(false)} 
                    className="absolute right-6 top-6 rounded-2xl hover:bg-zinc-100 cursor-pointer"
                    id="close-order-modal-btn"
                  >
                    <X className="w-5 h-5 text-zinc-500" />
                  </Button>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="p-2 bg-[#E15A2B]/10 text-[#E15A2B] rounded-xl flex items-center justify-center">
                        <Plus className="w-5 h-5" />
                      </span>
                      <h4 className="text-lg font-black text-zinc-900 tracking-tight">Formulir Order Rekrutmen Baru</h4>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium pl-1">
                      Kirim permintaan lowongan kerja baru. Tim kurasi kami akan memprioritaskan penyaringan talenta.
                    </p>
                  </div>

                  <form onSubmit={handleCreateOrder} className="space-y-5" id="create-order-form">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700">Nama Posisi Pekerjaan <span className="text-red-500">*</span></label>
                      <input 
                        type="text"
                        required
                        value={newOrderTitle}
                        onChange={(e) => setNewOrderTitle(e.target.value)}
                        placeholder="Contoh: Senior Fullstack Engineer"
                        className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-semibold text-zinc-900"
                        id="input-order-title"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-700">Departemen Utama</label>
                        <select 
                          value={newOrderDept} 
                          onChange={(e) => setNewOrderDept(e.target.value)}
                          className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-white focus:outline-none font-semibold text-zinc-900"
                          id="select-order-dept"
                        >
                          <option value="Engineering">Engineering / IT</option>
                          <option value="Design">Visual Design / UIUX</option>
                          <option value="Product">Product Management</option>
                          <option value="Marketing">Marketing & Business</option>
                          <option value="HR & Operations">HR & Operations</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-700">Tipe Kontrak Kerja</label>
                        <select 
                          value={newOrderType} 
                          onChange={(e) => setNewOrderType(e.target.value)}
                          className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-white focus:outline-none font-semibold text-zinc-900"
                          id="select-order-type"
                        >
                          <option value="Full-time">Full-time (Karyawan Tetap)</option>
                          <option value="Contract">Contract (Kontrak B2B)</option>
                          <option value="Internship">Internship (Magang)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-700">Estimasi Anggaran Gaji Bulanan</label>
                        <input 
                          type="text"
                          required
                          value={newOrderSalary}
                          onChange={(e) => setNewOrderSalary(e.target.value)}
                          placeholder="Misal: Rp 15M - 25M"
                          className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#E15A2B] font-semibold text-zinc-900"
                          id="input-order-salary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-700">Status Awal</label>
                        <select 
                          value={newOrderStatus} 
                          onChange={(e) => setNewOrderStatus(e.target.value as any)}
                          className="w-full px-4 py-3 border border-zinc-200 rounded-2xl text-xs bg-white focus:outline-none font-semibold text-zinc-900"
                          id="select-order-status"
                        >
                          <option value="Aktif">Aktif (Langsung Cari Talenta)</option>
                          <option value="Butuh Tindakan">Butuh Tindakan (Review Internal)</option>
                          <option value="Selesai">Selesai (Sudah Terisi)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="rounded-full px-6 text-zinc-500 font-bold hover:text-zinc-900 h-11 text-xs cursor-pointer"
                        onClick={() => setIsCreatingOrder(false)}
                        id="cancel-create-order-btn"
                      >
                        Batal
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-11 px-8 font-bold text-xs shadow-lg shadow-zinc-900/15 cursor-pointer"
                        id="submit-create-order-btn"
                      >
                        Kirim Order Lowongan
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {payingOrder && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="bg-white border-2 border-zinc-100 w-full max-w-md rounded p-8 shadow-2xl relative max-h-[calc(100vh-4rem)] overflow-y-auto"
                  id="pay-order-modal-container"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPayingOrder(null)}
                    disabled={isProcessingPayment}
                    className="absolute right-6 top-6 rounded-2xl hover:bg-zinc-100 cursor-pointer"
                    id="close-pay-modal-btn"
                  >
                    <X className="w-5 h-5 text-zinc-500" />
                  </Button>

                  <div className="mb-6">
                    <span className="text-[10px] uppercase tracking-widest bg-amber-100 text-[#E15A2B] font-bold px-2.5 py-1 rounded-full inline-block mb-2">
                      Portal Pembayaran Aman
                    </span>
                    <h4 className="text-xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#E15A2B]" /> Pelunasan Order Rekrutmen
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium mt-1">
                      Selesaikan pembayaran untuk memulai proses kurasi premium talenta high-caliber oleh tim profesional curating kami.
                    </p>
                  </div>

                  {/* Order summary box */}
                  <div className="bg-zinc-50 rounded-2xl p-4.5 border border-zinc-100 space-y-2.5 mb-6" id="payment-order-summary">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-bold">Ref No:</span>
                      <span className="font-extrabold text-zinc-900">{payingOrder.id}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-bold">Posisi Order:</span>
                      <span className="font-extrabold text-zinc-900 text-right">{payingOrder.title}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-bold">Departemen:</span>
                      <span className="font-extrabold text-[#E15A2B]">{payingOrder.dept}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500 font-bold">Tipe Kontrak:</span>
                      <span className="font-extrabold text-zinc-805">{payingOrder.type}</span>
                    </div>
                    <div className="border-t border-zinc-200/60 my-2 pt-2 flex justify-between text-xs">
                      <span className="text-zinc-800 font-extrabold">Total Biaya Jaminan:</span>
                      <span className="font-black text-base text-zinc-900">Rp 10.000.000 <span className="text-[10px] text-zinc-400 font-bold">/ flat</span></span>
                    </div>
                  </div>

                  {/* Payment method selection list */}
                  <div className="space-y-3 mb-6">
                    <label className="text-xs font-bold text-zinc-700 block">Metode Pembayaran:</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'VA' as const, label: 'Virtual Account', desc: 'Transfer Bank Otomatis' },
                        { id: 'CC' as const, label: 'Credit Card', desc: 'Visa, Mastercard secure' },
                        { id: 'QRIS' as const, label: 'Gopay / QRIS', desc: 'Satu QR kode instan' }
                      ].map((method) => {
                        const isSelected = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            disabled={isProcessingPayment}
                            className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[85px] hover:border-zinc-400 ${
                              isSelected ? 'border-zinc-900 bg-zinc-950 text-white' : 'border-zinc-200 bg-white text-zinc-900'
                            }`}
                          >
                            <span className="text-[11px] font-black tracking-tight">{method.label}</span>
                            <span className={`text-[8px] font-bold leading-tight ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                              {method.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Secure guarantee label */}
                  <div className="flex items-center gap-2 mb-6 bg-emerald-50 text-emerald-800 border border-emerald-150 p-3 rounded-xl text-[10px] font-bold">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Enkripsi Secure 256-bit SSL. Pembayaran Anda dijamin 100% aman dan bergaransi refund.</span>
                  </div>

                  {/* Payment buttons */}
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setPayingOrder(null)}
                      disabled={isProcessingPayment}
                      className="rounded-full px-5 text-zinc-500 font-bold hover:text-zinc-900 text-xs h-11 cursor-pointer transition-colors"
                    >
                      Batal
                    </button>
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={isProcessingPayment}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-11 px-8 font-extrabold text-xs shadow-lg shadow-zinc-900/15 flex items-center gap-2 justify-center cursor-pointer min-w-[140px]"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Bayar Sekarang</span>
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}

          </AnimatePresence>

        </div>
      </main>

    </div>
  );
}
