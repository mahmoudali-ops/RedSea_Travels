import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotfoundComponent } from './clientComponents/notfound/notfound.component';
import { HomeComponent } from './clientComponents/home/home.component';
import { ToursComponent } from './clientComponents/tours/tours.component';
import { HotelsComponent } from './clientComponents/hotels/hotels.component';
import { TransferComponent } from './clientComponents/transfer/transfer.component';
import { DestnationsComponent } from './clientComponents/destnations/destnations.component';
import { FaqComponent } from './clientComponents/faq/faq.component';
import { ServicesComponent } from './clientComponents/services/services.component';
import { LoginComponent } from './adminCompoents/login/login.component';
import { UsersComponent } from './adminCompoents/users/users.component';
import { RegisterComponent } from './adminCompoents/register/register.component';
import { DashboardComponent } from './adminCompoents/dashboard/dashboard.component';
import { TOurDetailComponent } from './clientComponents/tour-detail/tour-detail.component';
import { HotelDetailsComponent } from './clientComponents/hotel-details/hotel-details.component';
import { TransfersDetailComponent } from './clientComponents/transfers-detail/transfers-detail.component';
import { DesntationDetailComponent } from './clientComponents/desntation-detail/desntation-detail.component';
import { CategoryTourDetailComponent } from './clientComponents/category-tour-detail/category-tour-detail.component';
import { ToursAdComponent } from './adminCompoents/tours-ad/tours-ad.component';
import { EmailAdComponent } from './adminCompoents/email-ad/email-ad.component';
import { CategorytourAdComponent } from './adminCompoents/categorytour-ad/categorytour-ad.component';
import { DestnationAdComponent } from './adminCompoents/destnation-ad/destnation-ad.component';
import { HotelAdComponent } from './adminCompoents/hotel-ad/hotel-ad.component';
import { TrasnfersAdComponent } from './adminCompoents/trasnfers-ad/trasnfers-ad.component';
import { CreateTourComponent } from './adminCompoents/create-tour/create-tour.component';
import { UpdateTourComponent } from './adminCompoents/update-tour/update-tour.component';
import { CreateDestnaionsComponent } from './adminCompoents/create-destnaions/create-destnaions.component';
import { UpdateDestnaionsComponent } from './adminCompoents/update-destnaions/update-destnaions.component';
import { CreateCatTourComponent } from './adminCompoents/create-cat-tour/create-cat-tour.component';
import { UpdateCatTourComponent } from './adminCompoents/update-cat-tour/update-cat-tour.component';
import { CreateTransferComponent } from './adminCompoents/create-transfer/create-transfer.component';
import { UpdateTransferComponent } from './adminCompoents/update-transfer/update-transfer.component';
import { authGuardGuard } from './core/guards/auth-guard.guard';
import { UpdateAboutpageComponent } from './adminCompoents/update-aboutpage/update-aboutpage.component';
import { UpdateHomepageComponent } from './adminCompoents/update-homepage/update-homepage.component';
import { AboutComponent } from './clientComponents/about/about.component';

export const routes: Routes = [
    {
        path: '',component:ClientLayoutComponent,
        children:[
            {path: '',redirectTo: 'home',pathMatch: 'full' },
            {path: 'home',component:HomeComponent,title: 'Home' },  
            {path: 'tour',component:ToursComponent,title: 'Tours' },
            {path: 'transfer',component:TransferComponent,title: 'Transfers' },
            {path: 'tourDetail/:slug',component:TOurDetailComponent,title: 'Tour Details' },
            {path: 'transferDetail/:slug',component:TransfersDetailComponent,title: 'Transfers Details' },
            {path: 'categrytourDetail/:slug',component:CategoryTourDetailComponent,title: 'Tours Category Details' },
            {path: 'faq',component:FaqComponent,title: 'FAQ' },
            {path: 'about',component:AboutComponent,title: 'About' },
            {path: 'services',component:ServicesComponent,title: 'Services' }
        ] 
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
          // صفحات غير محمية (Login / Register)
          { path: 'login', component: LoginComponent, title: 'Login' },
          { path: 'register', component: RegisterComponent, title: 'Register' },
      
          // صفحات Dashboard محمية بالـ guard
          { path: 'tours', component: ToursAdComponent, title: 'Tours Dashboard', canActivate: [authGuardGuard] },
          { path: 'categorytour', component: CategorytourAdComponent, title: 'Category Tour Dashboard', canActivate: [authGuardGuard] },
          { path: 'destnaions', component: DestnationAdComponent, title: 'Destnaions Dashboard', canActivate: [authGuardGuard] },
          { path: 'hotels', component: HotelAdComponent, title: 'Hotels Dashboard', canActivate: [authGuardGuard] },
          { path: 'transfers', component: TrasnfersAdComponent, title: 'Transfers Dashboard', canActivate: [authGuardGuard] },
      
          { path: 'emails', component: EmailAdComponent, title: 'Emails', canActivate: [authGuardGuard] },
          { path: 'users', component: UsersComponent, title: 'Users', canActivate: [authGuardGuard] },
          { path: 'dashboard', component: ToursAdComponent, title: 'Dashboard', canActivate: [authGuardGuard] },
      
          // CRUD Tours محمية بالـ guard
          { path: 'tourCreate', component: CreateTourComponent, title: 'Admin Create a Tour', canActivate: [authGuardGuard] },
          { path: 'tourUpdate/:slug', component: UpdateTourComponent, title: 'Admin Update a Tour', canActivate: [authGuardGuard] },
      
          // CRUD Destinations محمية بالـ guard
          { path: 'destnationCreate', component: CreateDestnaionsComponent, title: 'Admin Create a Destnation', canActivate: [authGuardGuard] },
          { path: 'destnationUpdate/:id', component: UpdateDestnaionsComponent, title: 'Admin Update a Destnation', canActivate: [authGuardGuard] },
      
          // CRUD Category Tours محمية بالـ guard
          { path: 'catTourCreate', component: CreateCatTourComponent, title: 'Admin Create a Category Tour', canActivate: [authGuardGuard] },
          { path: 'catTourUpdate/:slug', component: UpdateCatTourComponent, title: 'Admin Update a Category Tour', canActivate: [authGuardGuard] },
      
          // CRUD Transfers محمية بالـ guard
          { path: 'transferCreate', component: CreateTransferComponent, title: 'Admin Create a Transfer', canActivate: [authGuardGuard] },
          { path: 'transferUpdate/:id', component: UpdateTransferComponent, title: 'Admin Update a Transfer', canActivate: [authGuardGuard] },
      
          // Home Page - About Page
          { path: 'homepage', component: UpdateHomepageComponent, title: 'Admin Update a Home Page', canActivate: [authGuardGuard] },
          { path: 'aboutpage', component: UpdateAboutpageComponent, title: 'Admin Update a About Page', canActivate: [authGuardGuard] },

          // redirect افتراضي لأي /admin يذهب للـ dashboard
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
          // صفحة not found داخل الـ admin
          { path: '**', redirectTo: 'dashboard' },
        ]
      }
      ,
    {
        path: '**',component:NotfoundComponent 
    }
];
