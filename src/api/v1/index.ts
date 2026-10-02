import { Router } from "express";
import taskRoutes from "../../modules/tasks/task.routes";
import categoryRoutes from "../../modules/Category/categories.routes";
import authorRoutes from "../../modules/biblioteca-api/authors/author.routes";
import bookRoutes from "../../modules/biblioteca-api/books/book.routes";
import loanRoutes from "../../modules/biblioteca-api/loans/loan.routes"; 
const router = Router();

router.use('/task', taskRoutes);
router.use('/category', categoryRoutes);
router.use('/author', authorRoutes);
router.use('/book', bookRoutes);    
router.use('/loan', loanRoutes); 
export default router;