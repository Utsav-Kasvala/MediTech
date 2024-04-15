import {faqs} from './../../assets/data/faqs'
import FaqItem from './FaqItem'
const FaqList = () => {
  return (
    <ul className='mt-[38px]'>
      {faqs.map((item,index)=>(
        <FaqItem item={item} key={index}/>
      ))}
    </ul>
  )
}
{/* {faqs.map((item,index)=>{
        return <FaqItem item={item} key={index}/> We can also use this syntax
}) */}

export default FaqList
