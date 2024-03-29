/* eslint-disable no-underscore-dangle */
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import LinkMUI from '@mui/material/Link'
import { Collapse, Divider, Grid } from '@mui/material'
import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { addLikeQuery, deleteLikeQuery, deletePostQuery } from '../../../../redux/actionCreators/postsActionCreators'
import Comments from '../Comments/Comments'
// eslint-disable-next-line import/order
import { FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

function Post({
  // eslint-disable-next-line camelcase
  _id, title, tags, text, image, created_at, author, comments, likes,
}) {
  const postTags = tags.length ? `#${tags.join(' #')}` : null
  const description = text.length > 50 ? `${text.slice(0, 50)}...` : text
  const updatedDate = new Date(created_at).toLocaleString()
  const avatarDefault = 'https://thumbs.dreamstime.com/b/%D0%B7%D0%BD%D0%B0%D1%87%D0%BE%D0%BA-%D0%BF%D0%BE-%D1%83%D0%BC%D0%BE%D0%BB%D1%87%D0%B0%D0%BD%D0%B8%D1%8E-%D0%BF%D0%BB%D0%BE%D1%81%D0%BA%D0%B8%D0%B9-%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80-%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F-%D1%81%D0%BE%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80-184330869.jpg'
  const idAuthor = useSelector((store) => store.user._id)

  const avatar = author ? author.avatar : avatarDefault

  const dispatch = useDispatch() // достаем dispatch

  const commentsFromServer = useSelector((store) => store.comments)

  const commentsForPost = commentsFromServer.filter((comment) => comment.post === _id).slice(-2)

  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  // функция удаления поста
  const deleteHandler = () => {
    dispatch(deletePostQuery(_id))
  }

  const isLike = likes.includes(idAuthor) // проверка наличия id пользователя в массиве лайков

  // поставить или удалить лайк по клику
  const likeHandler = () => {
    if (!isLike) {
      dispatch(addLikeQuery(_id))
    } else {
      dispatch(deleteLikeQuery(_id))
    }
  }

  return (
    <Grid
      item
      sx={{ width: 350 }}
    >
      <Card sx={{
        height: 460,
        display: 'flex',
        flexDirection: 'column',

      }}
      >
        <CardHeader
          sx={{
            mt: 0,
            height: 100,
          }}
          avatar={(
            <Avatar src={avatar} aria-label="post" />
          )}
          titleTypographyProps={{ variant: 'h7', fontWeight: 'bold' }}
          title={title}
        />
        <LinkMUI component={Link} to={`/post/${_id}`} sx={{ mt: 0 }}>
          <CardMedia
            component="img"
            image={image}
            height="200"
            alt={title}
          />
        </LinkMUI>
        <CardContent sx={{
          mb: 'auto',
        }}
        >
          <Typography variant="body2">
            {description}
          </Typography>
        </CardContent>
        <Box sx={{
          mb: 0,
        }}
        >
          <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" component="div" gutterBottom>
              {postTags}
            </Typography>
            <Typography variant="caption" component="div" gutterBottom sx={{ color: 'gray' }}>
              {updatedDate}
            </Typography>
          </CardActions>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Tooltip title="Лайк">
              <IconButton aria-label="like" onClick={likeHandler}>
                {!isLike
                  ? (<FavoriteBorderRounded sx={{ color: '#c62828' }} />
                  ) : (
                    <FavoriteRounded
                      sx={{
                        color: '#c62828',
                      }}
                    />
                  )}
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    textAlign: 'left',
                    p: 0.5,
                  }}
                >
                  {likes.length}
                </Typography>
              </IconButton>
            </Tooltip>
            <LinkMUI component={Link} to={`/post/${_id}`} sx={{ textDecoration: 'none' }}>
              <Button>Подробнее</Button>
            </LinkMUI>
            <Tooltip title="Удалить">
              <IconButton aria-label="delete" onClick={deleteHandler}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>
      <Divider />
      <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Комментарии
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Typography>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {commentsForPost.map((comment) => (
          // eslint-disable-next-line no-underscore-dangle
          <Comments key={comment._id} {...comment} />))}
        {comments.length ? null : (<Typography variant="body2" sx={{ fontStyle: 'italic' }}>Будьте первыми! Оставьте комментарий</Typography>)}
      </Collapse>
    </Grid>
  )
}

export default Post
