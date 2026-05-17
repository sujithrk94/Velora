# VELORA — Premium Lifestyle E-commerce

Velora is a sophisticated, minimalist e-commerce platform designed for modern living. It elevates everyday wear by offering clean silhouettes and premium comfort through a high-performance digital shopping experience.

## 1. Problem Statement
In an era of cluttered digital marketplaces, **Velora** solves the problem of "visual noise" in e-commerce. By focusing on a minimalist aesthetic, high-quality imagery, and a zero-friction user interface, it allows users to focus on the craftsmanship of the pieces rather than the complexity of the platform.

## 2. Technical Stack
| Category | Technology |
| :--- | :--- |
| **Frontend** | React 19 (Vite) |
| **Styling** | Tailwind CSS (v4) / Modern CSS |
| **Routing** | React Router 7 |
| **State Management** | React Context API |
| **Persistence** | LocalStorage API |
| **Icons** | Lucide React |

## 3. Feature List
- **Cinematic Hero Experience**: High-impact visual landing page with localized background blurs for readability.
- **Dynamic Cart Management**: Real-time bag updates with persistent state that survives page refreshes.
- **Strict Size Validation**: Smart "Add to Bag" logic that requires size selection, preventing order errors.
- **Custom Toast Notifications**: Inline, non-obtrusive feedback system for better user guidance.
- **Responsive Mobile-First Design**: Fully optimized for fluid interaction across all device sizes.
- **Modular Component Architecture**: Reusable UI patterns for consistent design language throughout.

## 4. Folder Structure
```bash
src/
├── components/   # Reusable UI (Navbar, CartSlider, ProductCard)
│   └── ui/       # Core layout primitives (Sheet, Dialog)
├── context/      # Global state (CartContext) for bag persistence
├── data/         # Centralized product catalog and configuration
├── pages/        # Main layouts (LandingPage, ProductDetailPage)
├── lib/          # Helper utilities (cn utility for Tailwind)
└── assets/       # Global styles and static brand resources
```

## 5. Summary of Challenges
One of the primary challenges was implementing a custom toast notification system and a controlled side cart without relying on external heavy libraries, ensuring the application remained lightweight and fast. Transitioning from a database-dependent state to a robust `localStorage` persistence model required careful synchronization to keep the "dynamic" feel of the cart instantaneous. Additionally, balancing the rich visual aesthetics—such as the cinematic hero section and backdrop blurs—with performance and accessibility was a key design focus. Finally, refactoring the product data flow to be centrally managed allowed for a more maintainable and reliable production environment.
