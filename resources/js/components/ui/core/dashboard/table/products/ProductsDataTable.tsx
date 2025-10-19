import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/fragments/shadcn-ui/table"
  import { ProductsSchema as ProductsSchema } from "@/lib/validations/index.t";
  import { Box, Calendar, CircleCheck, CircleIcon, CircleXIcon, DollarSign, DoorOpen, EllipsisIcon, Eye, EyeOff, ShoppingCart, Star, User2Icon, Users2Icon, XIcon } from "lucide-react"
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/fragments/shadcn-ui/dropdown-menu";
  import { Button } from "@/components/ui/fragments/shadcn-ui/button";

  import { CreateproductsSheet } from "../../sheet/create-products-sheet";
  import { Input } from "@/components/ui/fragments/shadcn-ui/input";
  import React from "react";
  import { Filters, PaginatedData, ProductResponse } from "@/types";
  import debounce from "lodash.debounce";
  import { router as inertiaRouter, router, usePage } from '@inertiajs/react'
  
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/fragments/shadcn-ui/avatar";
  import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
  } from "lucide-react"
  
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/fragments/shadcn-ui/select"
  import { cn } from "@/lib/utils";
  
  import { toast } from "sonner";
  import { Checkbox } from "@/components/ui/fragments/shadcn-ui/checkbox";
 import { EmptyState } from "@/components/ui/fragments/custom-ui/emtyp-state";
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge";
  
  import { TasksTableActionBar } from "./Products-table-action-bar";
import { UpdateProductSheet } from "../../sheet/update-product-sheet";
  import { useInitials } from "@/hooks/use-initials";
   import { DeleteTasksDialog } from "@/components/ui/fragments/custom-ui/delete-task-dialog";
import { getProductStatusIcon } from "@/lib/utils/products/ProductsStatus-utils";
import { ProductStatus, ProductStatusOptions } from "@/config/enums/ProductsStatus";
import { CategoryProductsStatus } from "@/config/enums/CategoryProductsStatus";
import { getCategoryIcon } from "@/lib/utils/products/category-utils";
import { formatIDR } from "@/hooks/use-money-format";
  
  

  
  export function ProductDataTable({ data}: { data : ProductResponse}) {
    const PaginatedData =  data.meta.pagination
    const Products =  data.data
    const filters =  data.meta.filters
  const [selectedIds, setSelectedIds] = React.useState<(number )[]>([]);
    const [open, setOpen] = React.useState(false);
    const [deletedId, setDeletedId] = React.useState<number | null>(null);
    const [openDelete, setOpenDelete] = React.useState(false);
       const currentPath = window.location.pathname;
            const pathNames = currentPath.split('/').filter(path => path)[1]
      //  const [completionFilter, setCompletionFilter] = React.useState<string>(filters.merek as string);
  const [searchTerm, setSearchTerm] = React.useState(filters.search);
    const [processing, setProcessing] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false)
      const debouncedSearch = React.useMemo(
      () =>
        debounce((search: string) => {
          router.get(route(`seller.products.index`), {
            search: search
          }, {
            preserveState: true,
            preserveScroll: true
          });
        }, 300),
      [pathNames] // Update dependencies
  );
  
    const AllIds: number[] = Products.map(item => item.id!);
  
    // Check if all items are selected
    const isAllSelected = AllIds.length > 0 && AllIds.every(id => selectedIds.includes(id));
    const isSomeSelected = selectedIds.length > 0 && selectedIds.length < AllIds.length;
  
    const handleDelete = (taskId: number) => {
      try {
        setProcessing(true);
        
  const id: number[] = [taskId] 
  
  console.log(taskId)
            toast.loading("Product deleting...",  { id: "products-delete" });
        router.delete(route(`seller.products.destroy`, id), {
          data: { ids: id } ,
          preserveScroll: true,
          preserveState: true,
          onBefore: () => {
            setProcessing(true);
          },
          onSuccess: () => {
            toast.success("Product deleted successfully",  { id: "products-delete" });
            setOpenModal(false);
            router.reload(); 
            
          },
          onError: (errors: any) => {
            console.error("Delete error:", errors);
            toast.error(errors?.message || "Failed to delete the products" , { id: "products-delete" });
          },
          onFinish: () => {
            setProcessing(false);
              setOpenDelete(false)
          setDeletedId(null)
          }
        });
              
      } catch (error) {
        console.error("Delete operation error:", error);
        toast.error("An unexpected error occurred",  { id: "products-delete" });
        setProcessing(false);
      }
    };
  
  
  
   const HandleSelectAll = () => {
      if (isAllSelected) {
        // If all selected, unselect all
        setSelectedIds([]);
      } else {
        // If not all selected, select all
        setSelectedIds([...AllIds]);
      }
    };
  
    const HandleSelect = (id: number) => {
      setSelectedIds(prevSelectedIds => {
        if (prevSelectedIds.includes(id)) {
          // Remove id from selection
          return prevSelectedIds.filter(selectedId => selectedId !== id);
        } else {
          // Add id to selection
          return [...prevSelectedIds, id];
        }
      });
    };
  
  
  const actions = [
    "update-status",
    "update-visiblity",
    "delete",
  ] as const;
  
    type Action = (typeof actions)[number];
    const [isPending, startTransition] = React.useTransition();
    const [currentAction, setCurrentAction] = React.useState<Action | null>(null);
  const [isAnyPending, setIsAnypending] = React.useState<boolean>(false);
    const getIsActionPending = React.useCallback(
      (action: Action) => isPending && currentAction === action,
      [isPending, currentAction],
    );
  
  
  
  
    
    const onTaskDelete = React.useCallback(() => {
      setCurrentAction("delete");
      setIsAnypending(true)
      toast.loading("Deleting data...", { id: "products-delete" });
      
      startTransition(async () => {
        try {
          router.delete(route(`seller.products.destroy`, selectedIds), {
            data: { ids: selectedIds },
            preserveScroll: true,
            preserveState: true,
   
            onSuccess: () => {
              toast.success("Products deleted successfully", { id: "products-delete" });
           setSelectedIds([])
              router.reload(); 
                setIsAnypending(false)
                setCurrentAction(null);
            },
            onError: (errors: any) => {
                setCurrentAction(null);
                        setIsAnypending(false)
              console.error("Delete error:", errors);
              toast.error(errors?.message || "Failed to delete the products", { id: "products-delete" });
            },
          });
  
        } catch (error) {
          toast.error("Failed to delete items", { id: "products-delete" });
          setCurrentAction(null);
        }
      });
    }, [Products, selectedIds, pathNames]);
  
  
  
    const onTaskUpdate = React.useCallback(
      ({
        field,
        value,
      }: {
        field: "status" | "category" ;
        value: string;
      }) => {
        const actionType: Action =
          field === "status" ? "update-status" :
              "update-visiblity";
     setIsAnypending(true)
        setCurrentAction(actionType);
  
        startTransition(async () => {
          try {
  
            const formData = {
                
                ids: selectedIds ,
                value: value,
                colum: field
                };
        
          
        
                router.post(route(`seller.products.status`, selectedIds), formData, {
                  preserveScroll: true,
                  preserveState: true,
                  forceFormData: true,
                  onBefore: (visit) => {
                    console.log('Update request about to start:', visit);
                  },
                  onStart: (visit) => {
                    console.log('Update request started');
                    toast.loading('Updating products data...', { id: 'update-toast' });
                  },
                  onSuccess: (page) => {
                    console.log('Update success response:', page);
                   setCurrentAction(null);
                        setIsAnypending(false)
                    toast.success('Products updated successfully', { id: 'update-toast' });
              
                  },
                  onError: (errors) => {
                      setCurrentAction(null);
                        setIsAnypending(false)
                    console.error('Update form submission error:', errors);
                    
          
                  },
                  onFinish: () => {
                   setCurrentAction(null);
                        setIsAnypending(false)
                    console.log('Update request finished');
                  }
                });
     
  
  
            // Success will be handled by useEffect when isPending becomes false
          } catch (error) {
            toast.error(`Failed to update ${field}`, { id: actionType });
            console.log(error)
            setCurrentAction(null);
              setIsAnypending(true)
          }
        });
      }, 
      [Products, selectedIds, pathNames],
    );
  
  const [currentProduct , setcurrentProduct ] = React.useState<(ProductsSchema) | null>(null);
      const [openUpdate, setOpenUpdate] = React.useState(false)
    const handleEdit = (products: ProductsSchema) => {
      setcurrentProduct(products);
      setOpenUpdate(true);
    };
   const handleUpdateClose = (open: boolean) => {
      setOpenUpdate(open);
      if (!open) {
        setTimeout(() => {
          setcurrentProduct(null);
        }, 500)
      }
    };
  
  
   
    const getInitial = useInitials()
  
    if(Products.length == 0 && filters.search == "")
  
   
    return(
      <>
    <EmptyState
            icons={[Calendar]}
            title={`No Product data yet`}
            description={`Start by adding your first products`}
            action={{
              label: `Add products`,
              onClick: () => setOpen(true)
            }}
          />
          <SheetComponents 
         
           
           trigger={false}
            open={open}
           onOpenChange={() => {
        setOpen(!open)
      }}
          />
      </>
    )
  
      return (
      <>
           <div 
        className={cn("flex w-full flex-col gap-2.5 overflow-auto")}
      >
      <div className=" w-full flex gap-3.5 justify-between">
             <Input
                placeholder={"Search..."}
               value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  debouncedSearch(value);
                }}
                className="md:max-w-[20em]   col-span-2  h-8 w-full  "
              />
                  <SheetComponents 
         
           
           trigger
            open={open}
           onOpenChange={() => {
        setOpen(!open)
      }}
          />
      </div>
        <main className="overflow-hidden rounded-xl border">

      <Table className="">
        <TableCaption className=" sr-only">A list of your recent products.</TableCaption>
        <TableHeader className="bg-accent/15">
          <TableRow>
            <TableHead className="">   
                  <Checkbox
               checked={isAllSelected}
                           onCheckedChange={HandleSelectAll}
  
              aria-label="Select all"
              className="translate-y-0.5  mx-3   mr-4"
            /></TableHead>
            {Products.length >= 1 && (
              <>
            <TableHead className=" ">Name</TableHead>
            <TableHead className=" ">Price</TableHead>
  
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Avg Rating</TableHead>
            {/* <TableHead>Product Di Pinjam</TableHead> */}
            <TableHead>Stock</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead>Created At</TableHead>
          
  
            <TableHead className="">action</TableHead>
              </>
            )
              
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {Products.length > 0 ?  Products.map((products) =>{ 

       const status = products.status as ProductStatus
       const category = products.category as CategoryProductsStatus
       const IconStatus = getProductStatusIcon(status );
       const IconProduct = getCategoryIcon(category );

          const price = formatIDR(products.price)
          return(
   
            <TableRow key={products.id}>
              <TableCell className="font-medium sticky right-0 ">
                 <Checkbox
                checked={selectedIds.includes(products.id!)}
                        onCheckedChange={() => HandleSelect(products.id!)}
              aria-label="Select row"
              className="translate-y-0.5  mx-3   mr-4"
            /></TableCell>
         <TableCell className="  flex items-center gap-5" 
              
   
              > 
              
                 <Avatar className=" rounded-xl  relative flex size-20 shrink-0 overflow-hidden">
                                          <AvatarImage src={`${products?.cover_image!}`} alt={products.name} />
                                          <AvatarFallback className="rounded-xl  bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                              {getInitial(products.name)}
                                          </AvatarFallback>
                                      </Avatar>
              <h4 className=" font-medium">
                {products.name}
                </h4>
              </TableCell>
   
              
  
          
              <TableCell className="">  
     
  
          {price}
  
        </TableCell>
              <TableCell className="">  
                    <Badge variant="outline" icon={IconProduct} className="py-1 [&>svg]:size-3.5">
    
          {products.category}
        </Badge>
        </TableCell>
          
            <TableCell>
              
            <Badge icon={IconStatus}  variant="outline" className="py-1 [&>svg]:size-3.5">
              {products.status}
              </Badge>
    </TableCell>
            <TableCell>
              
            <Badge icon={Star} variant="outline" className="py-1 [&>svg]:size-3.5">
         { products.reviews_avg_star_rating != null ?  Math.round(products.reviews_avg_star_rating! * 10) / 10 : 0.0 }
              </Badge>
    </TableCell>
  
    
            <TableCell>    
                   <Badge variant="outline" icon={Box} className="py-1 [&>svg]:size-3.5">
         
            
              <span className="capitalize  underline-offset-4  hover:underline font-mono">{products.stock}</span>
           
            </Badge>
            </TableCell>
     
            <TableCell>    
                   <Badge variant="outline" icon={ShoppingCart} className="py-1 [&>svg]:size-3.5">
         
            
              <span className="capitalize  underline-offset-4  hover:underline font-mono">{products.order_item_count}</span>
           
            </Badge>
            </TableCell>
     
            <TableCell className="">{products.created_at ? new Date(products.created_at).toLocaleDateString() : 'N/A'}</TableCell>

              <TableCell className=" w-fit">
                  <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <EllipsisIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
          
                <DropdownMenuItem
                  onSelect={() => handleEdit(products)}
                >
                  Edit
                </DropdownMenuItem>
    
  
                <DropdownMenuSeparator />
                <DropdownMenuItem
               onSelect={() => {
                setOpenDelete(true)
               setDeletedId(products.id!)
              }}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
         
                           
              </DropdownMenuContent>
            </DropdownMenu>
            </TableCell>
  
            </TableRow>
         
      
          )}
        
        ) : (
                <TableRow>
                  <TableCell
                    colSpan={Products.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
          )}
            
        </TableBody>
      
  
      </Table>
        </main>
 
  
  </div>
    

      
      <footer className=  "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
        <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
      {selectedIds.length} of {Products.length} row(s) selected.
        </div>
        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${PaginatedData.perPage}`}
              onValueChange={(value) => {
                  inertiaRouter.get(
             route(`seller.products.index`),
             { 
               perPage:value,
               
            
           
             },
             { 
               preserveState: true,
               preserveScroll: true,
              
             }
           )
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={`${PaginatedData.perPage}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {PaginatedData.currentPage} of{" "}
            {PaginatedData.lastPage}
         
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                   inertiaRouter.get(
             route(`seller.products.index`),
             { 
               page: 1,
               search: filters?.search,
           
             },
             { 
               preserveState: true,
               preserveScroll: true,
              
             }
           )
              }}
              disabled={PaginatedData.currentPage == 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
                  onClick={() => {
                   inertiaRouter.get(
             route(`seller.products.index`),
             { 
               page: PaginatedData.currentPage - 1,
        
               search: filters?.search,
           
             },
             { 
               preserveState: true,
               preserveScroll: true,
              
             }
           )
              }}
              disabled={PaginatedData.currentPage == 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                   inertiaRouter.get(
             route(`seller.products.index`),
             { 
               page: PaginatedData.currentPage + 1,
        
               search: filters?.search,
           
             },
             { 
               preserveState: true,
               preserveScroll: true,
            
             }
           )
              }}
            disabled={PaginatedData.currentPage == PaginatedData.lastPage}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => {
                   inertiaRouter.get(
             route(`seller.products.index`),
             { 
               page: PaginatedData.lastPage,
        
               search: filters?.search,
           
             },
             { 
               preserveState: true,
               preserveScroll: true,
       
             }
           )
              }}
           disabled={PaginatedData.currentPage == PaginatedData.lastPage}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>

      {deletedId && (
  
      <DeleteTasksDialog open={openDelete} handledeDelete={handleDelete} processing={processing} id={deletedId} trigger={false} onOpenChange={setOpenDelete}/>
      )}
    {selectedIds.length > 0 && (
          <TasksTableActionBar
          onTaskUpdate={onTaskUpdate}
          isPending={isAnyPending}
          setSelected={setSelectedIds}
            onTaskDelete={onTaskDelete}
            table={selectedIds}
            // getIsActionPending={getIsActionPending}
          />
        )}
            {currentProduct && (
  
         <UpdateProductSheet
         product={currentProduct}
           
                    open={openUpdate} 
                    onOpenChange={handleUpdateClose}
                  />
            )}
      </>
    )
  }
  
  
  
  const SheetComponents = React.memo(({ 
  
    open, 
    trigger,
    onOpenChange,
  }: {
  
    trigger?: boolean
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => {
  
    return (
      <CreateproductsSheet
        trigger={trigger} 
        open={open} 
        onOpenChange={onOpenChange}
      />
    );
  });
  
  SheetComponents.displayName = 'SheetComponents';