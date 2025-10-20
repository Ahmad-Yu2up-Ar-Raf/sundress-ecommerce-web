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


  import { Input } from "@/components/ui/fragments/shadcn-ui/input";
  import React from "react";
  import { ApiResponseOrderItems } from "@/types";
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
  


import { useInitials } from "@/hooks/use-initials";
import { DeleteTasksDialog } from "@/components/ui/fragments/custom-ui/delete-task-dialog";


import { formatIDR } from "@/hooks/use-money-format";
import { TasksTableActionBar } from "./OrderItems-table-action-bar";
import { getOrderItemStatusIcon } from "@/lib/utils/orders/getOrderItemStatus";
import { OrderItemStatus } from "@/config/enums/OrderItemStatus";
  
  

  
  export function OrderDataTable({ data}: { data : ApiResponseOrderItems}) {
    const PaginatedData =  data.meta.pagination
    const Orders =  data.data
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
          router.get(route(`seller.orders.index`), {
            search: search
          }, {
            preserveState: true,
            preserveScroll: true
          });
        }, 300),
      [pathNames] // Update dependencies
  );
  
    const AllIds: number[] = Orders.map(item => item.id!);
  
    // Check if all items are selected
    const isAllSelected = AllIds.length > 0 && AllIds.every(id => selectedIds.includes(id));
    const isSomeSelected = selectedIds.length > 0 && selectedIds.length < AllIds.length;
  
    const handleDelete = (taskId: number) => {
      try {
        setProcessing(true);
        
  const id: number[] = [taskId] 
  
  console.log(taskId)
            toast.loading("Order deleting...",  { id: "orders-delete" });
        router.delete(route(`seller.orders.destroy`, id), {
          data: { ids: id } ,
          preserveScroll: true,
          preserveState: true,
          onBefore: () => {
            setProcessing(true);
          },
          onSuccess: () => {
            toast.success("Order deleted successfully",  { id: "orders-delete" });
            setOpenModal(false);
            router.reload(); 
            
          },
          onError: (errors: any) => {
            console.error("Delete error:", errors);
            toast.error(errors?.message || "Failed to delete the orders" , { id: "orders-delete" });
          },
          onFinish: () => {
            setProcessing(false);
              setOpenDelete(false)
          setDeletedId(null)
          }
        });
              
      } catch (error) {
        console.error("Delete operation error:", error);
        toast.error("An unexpected error occurred",  { id: "orders-delete" });
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
      toast.loading("Deleting data...", { id: "orders-delete" });
      
      startTransition(async () => {
        try {
          router.delete(route(`seller.orders.destroy`, selectedIds), {
            data: { ids: selectedIds },
            preserveScroll: true,
            preserveState: true,
   
            onSuccess: () => {
              toast.success("Orders deleted successfully", { id: "orders-delete" });
           setSelectedIds([])
              router.reload(); 
                setIsAnypending(false)
                setCurrentAction(null);
            },
            onError: (errors: any) => {
                setCurrentAction(null);
                        setIsAnypending(false)
              console.error("Delete error:", errors);
              toast.error(errors?.message || "Failed to delete the orders", { id: "orders-delete" });
            },
          });
  
        } catch (error) {
          toast.error("Failed to delete items", { id: "orders-delete" });
          setCurrentAction(null);
        }
      });
    }, [Orders, selectedIds, pathNames]);
  
  
  
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
        
          
        
                router.post(route(`seller.orders.status`, selectedIds), formData, {
                  preserveScroll: true,
                  preserveState: true,
                  forceFormData: true,
                  onBefore: (visit) => {
                    console.log('Update request about to start:', visit);
                  },
                  onStart: (visit) => {
                    console.log('Update request started');
                    toast.loading('Updating orders data...', { id: 'update-toast' });
                  },
                  onSuccess: (page) => {
                    console.log('Update success response:', page);
                   setCurrentAction(null);
                        setIsAnypending(false)
                    toast.success('Orders updated successfully', { id: 'update-toast' });
              
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
      [Orders, selectedIds, pathNames],
    );
  

  
   
    const getInitial = useInitials()
  
    if(Orders.length == 0 && filters.search == "")
  
   
    return(
      <>
    <EmptyState
            icons={[Calendar]}
            title={`No Order data yet`}
            description={`Start by adding your first orders`}
           
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
                
      </div>
        <main className="overflow-hidden rounded-xl border">

      <Table className="">
        <TableCaption className=" sr-only">A list of your recent orders.</TableCaption>
        <TableHeader className="bg-accent/15">
          <TableRow>
            <TableHead className="">   
                  <Checkbox
               checked={isAllSelected}
                           onCheckedChange={HandleSelectAll}
  
              aria-label="Select all"
              className="translate-y-0.5  mx-3   mr-4"
            /></TableHead>
            {Orders.length >= 1 && (
              <>
            <TableHead className=" ">Product</TableHead>
            <TableHead className=" ">Sub Total</TableHead>
  
         
            <TableHead>Status</TableHead>
       
            {/* <TableHead>Order Di Pinjam</TableHead> */}
            <TableHead>Order Quantity</TableHead>
          
            <TableHead>Order At</TableHead>
          
  
            <TableHead className="">action</TableHead>
              </>
            )
              
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {Orders.length > 0 ?  Orders.map((order) =>{ 
  const product = order.product
       const status = order.status as OrderItemStatus
       const IconStatus = getOrderItemStatusIcon(status );
    

          const price = formatIDR(order!.sub_total)
          return(
   
            <TableRow key={order.id}>
              <TableCell className="font-medium sticky right-0 ">
                 <Checkbox
                checked={selectedIds.includes(order.id!)}
                        onCheckedChange={() => HandleSelect(order.id!)}
              aria-label="Select row"
              className="translate-y-0.5  mx-3   mr-4"
            /></TableCell>
         <TableCell className="  flex items-center gap-5" 
              
   
              > 
              
                 <Avatar className=" rounded-xl  relative flex size-20 shrink-0 overflow-hidden">
                                          <AvatarImage src={`${product?.cover_image!}`} alt={`${order.id}`} />
                                          <AvatarFallback className="rounded-xl  bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                              {getInitial(product?.name!)}
                                          </AvatarFallback>
                                      </Avatar>
              <h4 className=" font-medium">
                {product?.name!}
                </h4>
              </TableCell>
   
              
  
          
              <TableCell className="">  
     
  
          {price}
  
        </TableCell>
             
          
            <TableCell>
              
            <Badge icon={IconStatus}  variant="outline" className="py-1 [&>svg]:size-3.5">
              {order.status}
              </Badge>
    </TableCell>
       
  
    
            <TableCell>    
                   <Badge variant="outline" icon={Box} className="py-1 [&>svg]:size-3.5">
         
            
              <span className="capitalize  underline-offset-4  hover:underline font-mono">{order.quantity}</span>
           
            </Badge>
            </TableCell>
     
            <TableCell className="">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</TableCell>

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
               onSelect={() => {
                setOpenDelete(true)
               setDeletedId(order.id!)
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
                    colSpan={Orders.length}
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
      {selectedIds.length} of {Orders.length} row(s) selected.
        </div>
        <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${PaginatedData.perPage}`}
              onValueChange={(value) => {
                  inertiaRouter.get(
             route(`seller.orders.index`),
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
             route(`seller.orders.index`),
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
             route(`seller.orders.index`),
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
             route(`seller.orders.index`),
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
             route(`seller.orders.index`),
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
         
      </>
    )
  }
  
  
