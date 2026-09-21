import React, { useState } from "react";
import { Heart, Truck, Package, CheckCircle2, Mail, Navigation } from "lucide-react";
import { T } from "./constants/theme";
import { DEMO_ACCOUNTS, RECEIVERS_POOL, seedDonations } from "./constants/data";
import { minsFromNow } from "./utils/dateUtils";
import { aiUrgency } from "./utils/aiServices";

// Components
import Navbar from "./components/layout/Navbar";
import Btn from "./components/common/Btn";
import EmailCenterModal from "./components/modals/EmailCenterModal";
import DonationDetailModal from "./components/modals/DonationDetailModal";
import InteractiveRescueMap from "./components/map/InteractiveRescueMap";
import CreateDonationForm from "./components/donations/CreateDonationForm";
import AiHelpAssistant from "./components/common/AiHelpAssistant";
import ReviewsModal from "./components/common/ReviewsModal";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ImpactDashboard from "./pages/ImpactDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import ReceiverDashboard from "./pages/ReceiverDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";

export default function FoodBridgeApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("auth"); // Strict Sign-In gate: Opens directly to Auth
  const [donations, setDonations] = useState(seedDonations);
  const [showAiHelpModal, setShowAiHelpModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "n1", text: "🍲 New Hyderabadi Veg Biryani donation posted in Jubilee Hills.", at: minsFromNow(-10), read: false },
    { id: "n2", text: "🚚 Delivery Partner Kiran Kumar dispatched for Madhapur shelter run.", at: minsFromNow(-25), read: true },
  ]);

  // Private sent emails repository
  const [sentEmails, setSentEmails] = useState([
    {
      id: "em-user-1",
      recipient: "user@foodbridge.org",
      subject: "🎉 Welcome to Food Bridge Hyderabad! Account Verified",
      preview: "Welcome Ramesh Rao! Your account is active for Donor & Receiver hubs.",
      bodyText: "Your account (user@foodbridge.org) has been verified. You can now post surplus food or claim donations for local Hyderabad shelters.",
      code: "892104",
      at: minsFromNow(-120),
    },
    {
      id: "em-receiver-1",
      recipient: "receiver@foodbridge.org",
      subject: "🎉 Welcome Sneha Orphanage to Food Bridge Hyderabad",
      preview: "Welcome Anitha Reddy! Your shelter account is verified to receive food.",
      bodyText: "Your shelter organization is approved. You can now browse available food in Hyderabad, claim orders, and set designated delivery drop points.",
      code: "741258",
      at: minsFromNow(-90),
    },
    {
      id: "em-delivery-1",
      recipient: "delivery@foodbridge.org",
      subject: "🛵 Delivery Partner Onboarding Verified — Hyderabad",
      preview: "Welcome Kiran Kumar! Your delivery partner account is online.",
      bodyText: "You are onboarded as an authorized delivery partner in Hyderabad. Access the delivery console to view pickup routes, donor phone numbers, and shelter drop-off spots.",
      code: "369852",
      at: minsFromNow(-60),
    },
  ]);

  const [showNotif, setShowNotif] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [liveToast, setLiveToast] = useState(null);

  function pushNotif(text) {
    setNotifications((prev) => [{ id: `n${Date.now()}`, text, at: new Date(), read: false }, ...prev]);
  }

  // PRIVATE EMAIL DISPATCHER (Sends strictly to targeted recipient)
  function handleSendEmail(mailObj) {
    const newMail = { id: `em-${Date.now()}`, at: new Date(), ...mailObj };
    setSentEmails((prev) => [newMail, ...prev]);

    // Show instant toast only if it belongs to current active user session
    if (!user || mailObj.recipient?.toLowerCase().trim() === user?.email?.toLowerCase().trim()) {
      setLiveToast({
        title: `📧 Private Email: ${mailObj.recipient}`,
        subject: mailObj.subject,
        emailId: newMail.id,
      });
      setTimeout(() => setLiveToast(null), 6000);
    }
  }

  function handleLogin(account) {
    setUser(account);
    if (account.role === "DELIVERY_PARTNER") {
      setView("delivery");
    } else {
      setView("donor");
    }
    pushNotif(`👋 Welcome back, ${account.name}! Logged in successfully.`);
  }

  function handleLogout() {
    setUser(null);
    setView("landing");
  }

  function openDetail(d) {
    setSelectedDonationId(d.id);
    setShowNotif(false);
  }

  // DONOR CREATES DONATION
  function handleCreate(payload) {
    const now = Date.now();
    const consumeBefore = minsFromNow(payload.consumeBeforeMins);

    // Generate coordinates in Hyderabad around Jubilee/Banjara/Hitec City
    const hydLat = 17.4250 + (Math.random() - 0.5) * 0.04;
    const hydLng = 78.4150 + (Math.random() - 0.5) * 0.04;

    const newD = {
      id: `fb-hyd-${now}`,
      donorId: user?.email || "user@foodbridge.org",
      donorName: payload.donorName || user?.name || "Ramesh Rao",
      donorPhone: payload.donorPhone || user?.cellNo || "+91 98480 12345",
      donorHouse: payload.donorHouse || user?.houseName || "Sai Nilayam",
      donorStreet: payload.donorStreet || user?.street || "Banjara Hills",
      donorPincode: payload.donorPincode || user?.pincode || "500034",
      foodName: payload.foodName,
      category: payload.category,
      quantity: payload.quantity,
      unit: payload.unit,
      vegetarian: payload.vegetarian,
      estimatedPortions: payload.quantity,
      prepTime: new Date(),
      consumeBefore,
      pickupStart: new Date(),
      pickupEnd: minsFromNow(payload.pickupEndMins),
      pickupAddress: payload.pickupAddress,
      pickupLat: hydLat,
      pickupLng: hydLng,
      deliveryName: null,
      receiverPhone: null,
      receiverDropPoint: null,
      receiverHouse: null,
      receiverStreet: null,
      receiverPincode: null,
      deliveryAddress: null,
      deliveryLat: null,
      deliveryLng: null,
      distanceKm: "3.5",
      notes: payload.notes,
      status: "AVAILABLE",
      urgencyLevel: aiUrgency(payload.consumeBeforeMins).level,
      receiverId: null,
      volunteerId: null,
      volunteerName: null,
      volunteerPhone: null,
      courierProgress: 0,
      createdAt: new Date(),
      timeline: [{ stage: "Donation Created", at: new Date() }],
    };

    setDonations((prev) => [newD, ...prev]);
    pushNotif(`🍲 New Food Donation Published: ${payload.foodName} in Hyderabad.`);

    // Send confirmation email EXCLUSIVELY to this donor's email address
    handleSendEmail({
      recipient: user?.email || "user@foodbridge.org",
      subject: `📋 Donation Published: ${payload.foodName}`,
      preview: `Your donation of ${payload.quantity} ${payload.unit} is live in Hyderabad.`,
      bodyText: `Your surplus food donation for '${payload.foodName}' at '${payload.pickupAddress}' (Cell: ${payload.donorPhone || user?.cellNo}) is published on Food Bridge. Nearby shelters and couriers have been alerted.`,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
    });

    setView("donor");
  }

  // RECEIVER CLAIMS DONATION (Locks, Pins and sets Drop-off details)
  function claimDonation(id, receiverPayload) {
    const selectedShelter = RECEIVERS_POOL[0];

    setDonations((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;

        return {
          ...d,
          status: "CLAIMED",
          receiverId: receiverPayload.email,
          receiverName: receiverPayload.name,
          receiverPhone: receiverPayload.phone,
          receiverDropPoint: receiverPayload.dropPoint,
          receiverHouse: receiverPayload.houseName,
          receiverStreet: receiverPayload.street,
          receiverPincode: receiverPayload.pincode,
          deliveryName: receiverPayload.name,
          deliveryAddress: receiverPayload.fullAddress,
          deliveryLat: selectedShelter.lat,
          deliveryLng: selectedShelter.lng,
          timeline: [...d.timeline, { stage: "Claimed & Pinned by Receiver", at: new Date() }],
        };
      })
    );

    pushNotif(`✅ Order locked & pinned to ${receiverPayload.name} (${receiverPayload.dropPoint}).`);

    // Send claim receipt email EXCLUSIVELY to this receiver's email address
    handleSendEmail({
      recipient: receiverPayload.email,
      subject: `📦 Food Claim Confirmed & Pinned — Food Bridge Hyderabad`,
      preview: `You claimed food package: ${receiverPayload.name}.`,
      bodyText: `Your claim has been assigned to drop point: ${receiverPayload.dropPoint} (${receiverPayload.fullAddress}). A delivery partner will collect and deliver it to your shelter.`,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
    });

    setSelectedDonationId(null);
  }

  // DELIVERY PARTNER UPDATES STATUS
  function updateStatus(id, status, volunteer, isAccept) {
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const timeline = [...d.timeline];
        const stageMap = {
          CLAIMED: "Delivery Partner Dispatched",
          PICKED_UP: "Food Picked Up from Donor",
          IN_TRANSIT: "In Live GPS Transit",
          DELIVERED: "Safely Handed Over at Drop Point",
        };

        if (isAccept) timeline.push({ stage: "Delivery Partner Dispatched", at: new Date() });
        else if (stageMap[status]) timeline.push({ stage: stageMap[status], at: new Date() });

        return {
          ...d,
          status,
          volunteerId: volunteer.email,
          volunteerName: volunteer.name,
          volunteerPhone: volunteer.cellNo || "+91 99887 65432",
          courierProgress: status === "DELIVERED" ? 1 : status === "IN_TRANSIT" ? 0.65 : 0.25,
          timeline,
        };
      })
    );

    if (status === "DELIVERED") {
      pushNotif(`🎉 Food delivery successfully completed by ${volunteer.name}!`);

      // Send delivery confirmation email EXCLUSIVELY to this delivery partner's email
      handleSendEmail({
        recipient: volunteer.email,
        subject: `✅ Delivery Run Completed — Food Bridge`,
        preview: `Delivery confirmed for order ${id}.`,
        bodyText: `Thank you ${volunteer.name}! You successfully completed the delivery run. Meal impact has been credited to your courier profile.`,
        code: Math.floor(100000 + Math.random() * 900000).toString(),
      });
    } else if (isAccept) {
      pushNotif(`🛵 ${volunteer.name} accepted pickup route.`);

      // Send dispatch assignment email EXCLUSIVELY to this delivery partner's email
      handleSendEmail({
        recipient: volunteer.email,
        subject: `🛵 New Route Assigned: ${volunteer.name}`,
        preview: `Pickup route confirmed for order ${id}.`,
        bodyText: `You have locked in pickup route for order ${id}. Proceed to donor pickup location. Side GPS radar is active on your console.`,
        code: Math.floor(100000 + Math.random() * 900000).toString(),
      });
    }

    setSelectedDonationId(null);
  }

  function confirmReceipt(id) {
    setDonations((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "COMPLETED",
              timeline: [...d.timeline, { stage: "Meal Receipt Confirmed", at: new Date() }],
            }
          : d
      )
    );
    pushNotif("Meal receipt confirmed & verified in Hyderabad impact network.");
    setSelectedDonationId(null);
  }

  const stats = {
    donations: donations.length + 680,
    meals: donations.reduce((s, d) => s + (d.quantity || 0), 0) + 6490,
    people: "4,250+",
    waste: "2.40 t",
  };

  const activeDonation = donations.find((d) => d.id === selectedDonationId);

  const detailActions = () => {
    if (!activeDonation || !user) return null;
    const d = activeDonation;

    if (user.role === "DELIVERY_PARTNER") {
      if (d.status === "CLAIMED" && !d.volunteerId) {
        return <Btn icon={Truck} onClick={() => updateStatus(d.id, "CLAIMED", user, true)}>Accept Courier Route</Btn>;
      }
      if (d.volunteerName === user.name || d.volunteerId === user.email) {
        if (d.status === "CLAIMED") return <Btn icon={Package} onClick={() => updateStatus(d.id, "PICKED_UP", user)}>Mark Picked Up from Donor</Btn>;
        if (d.status === "PICKED_UP") return <Btn icon={Truck} onClick={() => updateStatus(d.id, "IN_TRANSIT", user)}>Start Live Transit</Btn>;
        if (d.status === "IN_TRANSIT") return <Btn icon={CheckCircle2} onClick={() => updateStatus(d.id, "DELIVERED", user)}>Confirm Drop-off Handover</Btn>;
      }
    } else {
      // User (Donor / Receiver)
      if (d.status === "AVAILABLE") {
        return (
          <Btn icon={Heart} onClick={() => { setView("receiver"); setSelectedDonationId(null); }}>
            Claim Food (Go to Receiver Hub)
          </Btn>
        );
      }
      if (d.status === "DELIVERED" && (d.receiverName === user.name || d.receiverId === user.email)) {
        return <Btn icon={CheckCircle2} onClick={() => confirmReceipt(d.id)}>Confirm Meal Receipt</Btn>;
      }
    }
    return null;
  };

  let pageContent;
  // Strict Sign-In Protection: If not logged in, dashboards & rescue actions are locked
  if (!user) {
    if (view === "landing") {
      pageContent = <LandingPage setView={setView} stats={stats} onOpenLiveMap={() => setView("auth")} />;
    } else {
      pageContent = <AuthPage onLogin={handleLogin} onSendEmail={handleSendEmail} />;
    }
  } else if (view === "auth") {
    pageContent = <AuthPage onLogin={handleLogin} onSendEmail={handleSendEmail} />;
  } else if (view === "create") {
    pageContent = <CreateDonationForm user={user} onCreate={handleCreate} onCancel={() => setView("donor")} />;
  } else if (view === "map") {
    pageContent = <InteractiveRescueMap donations={donations} onOpenDetail={openDetail} user={user} />;
  } else if (view === "impact") {
    pageContent = <ImpactDashboard />;
  } else if (view === "donor") {
    pageContent = <DonorDashboard user={user} donations={donations} setView={setView} openDetail={openDetail} />;
  } else if (view === "receiver") {
    pageContent = <ReceiverDashboard user={user} donations={donations} openDetail={openDetail} claimDonation={claimDonation} setView={setView} />;
  } else if (view === "delivery") {
    pageContent = <VolunteerDashboard user={user} donations={donations} openDetail={openDetail} updateStatus={updateStatus} setView={setView} />;
  } else {
    pageContent = <LandingPage setView={setView} stats={stats} onOpenLiveMap={() => setView("map")} />;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: T.body, color: T.ink }} onClick={() => showNotif && setShowNotif(false)}>
      {/* Top Navbar */}
      <Navbar
        user={user}
        view={view}
        setView={setView}
        notifications={notifications}
        showNotif={showNotif}
        setShowNotif={setShowNotif}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        sentEmails={sentEmails}
        onOpenEmailCenter={() => setShowEmailModal(true)}
        onOpenAiHelp={() => setShowAiHelpModal(true)}
        onOpenReviews={() => setShowReviewsModal(true)}
      />

      {/* Main Page Content */}
      <main>{pageContent}</main>

      {/* 🤖 AI Help Assistant & 24/7 Helpline Modal */}
      <AiHelpAssistant
        isOpen={showAiHelpModal}
        onClose={() => setShowAiHelpModal(false)}
        user={user}
      />

      {/* ⭐ User Ratings & Reviews Recommendations Modal */}
      <ReviewsModal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        user={user}
      />

      {/* Live Email Notification Toast */}
      {liveToast && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 120,
          background: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`,
          color: "#ffffff",
          padding: "14px 18px",
          borderRadius: 14,
          boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1px solid rgba(255,255,255,0.15)",
          animation: "slideIn 0.3s ease",
        }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: T.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Mail size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>{liveToast.title}</div>
            <div style={{ fontSize: 11.5, color: "#94A3B8" }}>{liveToast.subject}</div>
          </div>
          <button
            onClick={() => setShowEmailModal(true)}
            style={{
              background: T.primaryLight,
              color: "#065F46",
              border: "none",
              padding: "5px 10px",
              borderRadius: 8,
              fontSize: 11.5,
              fontWeight: 800,
              cursor: "pointer",
              marginLeft: 8,
            }}
          >
            Read Mail
          </button>
        </div>
      )}

      {/* Email Inbox Center Modal (Privately Filtered to Logged In User) */}
      <EmailCenterModal
        emails={sentEmails}
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        user={user}
      />

      {/* Donation Detail Modal */}
      {activeDonation && (
        <DonationDetailModal
          d={activeDonation}
          user={user}
          onClose={() => setSelectedDonationId(null)}
          actions={detailActions()}
        />
      )}
    </div>
  );
}
